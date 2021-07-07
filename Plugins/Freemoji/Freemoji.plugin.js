/**
* @name Freemoji
* @displayName Freemoji
* @description Send emoji without Nitro.
* @author Qb
* @authorId 133659541198864384
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
                }
            ],
            version: "1.2.0",
            description: "Send emoji without Nitro.",
            github: "https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/Freemoji",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/Freemoji/Freemoji.plugin.js"
        },
        defaultConfig: [
            {
                type: "switch",
                id: "removeGrayscale",
                name: "Remove Grayscale Filter",
                note: "Remove the grayscale filter on emoji that would normally not be usable.",
                value: true,
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
                WebpackModules
            } = Api;

            const Emojis = WebpackModules.findByUniqueProperties(['getDisambiguatedEmojiContext','search']);
            const EmojiParser = WebpackModules.findByUniqueProperties(['parse', 'parsePreprocessor', 'unparse']);
            const EmojiPicker = WebpackModules.findByUniqueProperties(['useEmojiSelectHandler']);
            const disabledEmojiSelector = `.${WebpackModules.getByProps('emojiItemDisabled')?.emojiItemDisabled}`;

            return class Freemoji extends Plugin {
                originalNitroStatus = 0;
                css = `
                ${disabledEmojiSelector} {
                    filter: grayscale(0%);
                }
                `;
                
                initialize() {
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
                        return function(data, state){
                            ret.apply(this, args)
                            if(data.emoji?.available) {
                                onSelectEmoji(data.emoji, state.isFinalSelection);
                                if(state.isFinalSelection) closePopout();
                            }
                        }
                    });

                    if (this.settings.removeGrayscale && !document.getElementById(`${config.info.name}--grayscale`)){
                        PluginUtilities.addStyle(`${config.info.name}--grayscale`, this.css);
                    } else {
                        PluginUtilities.removeStyle(`${config.info.name}--grayscale`);
                    }
                }

                cleanup() {
                    Patcher.unpatchAll();
                    PluginUtilities.removeStyle(`${config.info.name}--grayscale`);
                }

                onStart() {
                    if (!Emojis || !EmojiParser || !EmojiPicker) {
                        this.initialize = ()=>{};
                        return Toasts.error(`Couldn't start ${config.info.name}: Couldn't find Discord Modules`);
                    }
                    this.initialize();
                }
                
                onStop() {
                    this.cleanup();
                }
            
                getSettingsPanel() {
                    const panel = this.buildSettingsPanel();
                    panel.addListener(() => {
                        this.cleanup();
                        this.initialize();
                    });
                    return panel.getElement();
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
