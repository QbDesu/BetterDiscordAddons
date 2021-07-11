/**
* @name Freemoji
* @displayName Freemoji
* @description Send emoji external emoji and animated emoji without Nitro.
* @author Qb, An0
* @authorId 133659541198864384
* @license LGPLv3 - https://www.gnu.org/licenses/lgpl-3.0.txt
* @version 1.2.0
* @invite gj7JFa6mF8
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/Freemoji
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/Freemoji/Freemoji.plugin.js
*/
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {
        info: {
            name: "Freemoji",
            authors: [
                {
                    name: "Qb",
                    discord_id: "133659541198864384",
                    github_username: "QbDesu"
                },
                {
                    name: "An0",
                    github_username: "An00nymushun"
                }
            ],
            version: "1.2.0",
            description: "Send emoji external emoji and animated emoji without Nitro.",
            github: "https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/Freemoji",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/Freemoji/Freemoji.plugin.js"
        },
        defaultConfig: [
            {
                type: "dropdown",
                id: "removeGrayscale",
                name: "Remove Grayscale Filter",
                note: "Remove the grayscale filter on emoji that would normally not be usable.",
                value: 'embedPerms',
                options: [
                    {
                        label: 'Always',
                        value: 'always'
                    },
                    {
                        label: 'With Embed Perms',
                        value: 'embedPerms'
                    },
                    {
                        label: 'Never',
                        value: 'never'
                    }
                ]
            },
            {
                type: "dropdown",
                id: "missingEmbedPerms",
                name: "Missing Embed Perms Behaviour",
                note: "What should happen if the user selects an emote even though they have no embed permissions.",
                value: 'showDialog',
                options: [
                    {
                        label: 'Show Confirmation Dialog',
                        value: 'showDialog'
                    },
                    {
                        label: 'Insert Anyway',
                        value: 'insert'
                    },
                    {
                        label: 'Nothing',
                        value: 'nothing'
                    }
                ]
            },
            {
                type: "slider",
                id: "size",
                name: "Emoji Size",
                note: "The size of the emoji in pixels. 40 is recommended.",
                value: 40,
                markers:[16,20,32,40,64],
                stickToMarkers:true
            }
        ]
    };
    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        load() {
            BdApi.showConfirmationModal("Library plugin is needed", 
                [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() { }
        stop() { }
    }
    : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const {
                Patcher,
                PluginUtilities,
                WebpackModules,
                Toasts,
                Logger,
                Utilities,
                DiscordModules: {
                    Permissions,
                    DiscordPermissions,
                    UserStore,
                    SelectedChannelStore,
                    ChannelStore
                }
            } = Api;

            const Emojis = WebpackModules.findByUniqueProperties(['getDisambiguatedEmojiContext','search']);
            const EmojiParser = WebpackModules.findByUniqueProperties(['parse', 'parsePreprocessor', 'unparse']);
            const EmojiPicker = WebpackModules.findByUniqueProperties(['useEmojiSelectHandler']);
            const disabledEmojiSelector = `.${WebpackModules.getByProps('emojiItemDisabled')?.emojiItemDisabled}`;
            const ExpressionPicker = WebpackModules.getModule(e => e.type?.displayName === "ExpressionPicker");

            const removeGrayscaleClass = `${config.info.name}--remove-grayscale`;
            return class Freemoji extends Plugin {
                removeGrayscaleCss = `
                .${removeGrayscaleClass} ${disabledEmojiSelector} {
                    filter: grayscale(0%);
                }
                `;
                currentUser = null;

                addStyles() {
                    PluginUtilities.addStyle(removeGrayscaleClass, this.removeGrayscaleCss);
                }

                patch() {
                    // make emote pretend locked emoji are unlocked
                    Patcher.after(Emojis, 'search', (_, args, ret) => {
                        ret.unlocked = ret.unlocked.concat(ret.locked);
                        ret.locked.length = [];
                        return ret;
                    });

                    // replace emoji with links in messages
                    Patcher.after(EmojiParser, 'parse', (_, args, ret) => {
                        for(let emoji of ret.invalidEmojis) {
                            const emojiString = `<${emoji.animated ? "a" : ""}:${emoji.originalName || emoji.name}:${emoji.id}>`;
                            const emojiURL = `${emoji.url}&size=${this.settings.size}`;
                            ret.content = ret.content.replace(emojiString, emojiURL);
                        }
                        return ret;
                    });

                    // override emoji picker to allow selecting emotes
                    Patcher.after(EmojiPicker, 'useEmojiSelectHandler', (_, args, ret) => {
                        const { onSelectEmoji, closePopout } = args[0];
                        return (data, state) => {
                            ret.apply(this, args);
                            if(data.emoji?.available) {
                                if (data.isDisabled) {
                                    const perms = this.hasEmbedPerms();
                                    if (!perms && this.settings.missingEmbedPerms == 'nothing') return; 
                                    if (!perms && this.settings.missingEmbedPerms == 'showDialog') {
                                        BdApi.showConfirmationModal(
                                            "Missing Image Embed Permissions", 
                                            [`It looks like you are trying to send an Emoji using Freemoji but you dont have the permissions to send embeded images in this channel. You can choose to send it anyway but it will only show as a link.`], {
                                            confirmText: "Send Anyway",
                                            cancelText: "Cancel",
                                            onConfirm: () => {
                                                onSelectEmoji(data.emoji, state.isFinalSelection);
                                                if(state.isFinalSelection) closePopout();
                                            }
                                        });
                                        return;
                                    }
                                }
                                onSelectEmoji(data.emoji, state.isFinalSelection);
                                if(state.isFinalSelection) closePopout();
                            }
                            
                        }
                    });

                    // add remove grayscale class to expression picker
                    Patcher.after(ExpressionPicker, 'type', (_, args, ret) => {
                        if (this.settings.removeGrayscale=='never') return;
                        if (this.settings.removeGrayscale!='always' && !this.hasEmbedPerms()) return;
                        Utilities.getNestedProp(ret, "props.children.props").className += ` ${removeGrayscaleClass}`
                    });
                }

                hasEmbedPerms() {
                    if (!this.currentUser) this.currentUser = UserStore.getCurrentUser();
                    const channel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
                    if (!channel.guild_id) return true;
                    return Permissions.can(DiscordPermissions.EMBED_LINKS, this.currentUser.id, channel)
                }

                cleanup() {
                    Patcher.unpatchAll();
                    this.removeStyles();
                }

                removeStyles() {
                    PluginUtilities.removeStyle(removeGrayscaleClass);
                }

                onStart() {
                    try{
                        this.patch();
                        this.addStyles();
                    } catch (e) {
                        Toasts.error(`${config.info.name}: An error occured during intialiation: ${e}`);
                        Logger.error(`Error while patching: ${e}`);
                        console.error(e);
                    }
                }
                
                onStop() {
                    this.cleanup();
                }
            
                getSettingsPanel() {
                    const panel = this.buildSettingsPanel();
                    panel.addListener(() => {
                        this.removeStyles();
                        this.addStyles();
                    });
                    return panel.getElement();
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
