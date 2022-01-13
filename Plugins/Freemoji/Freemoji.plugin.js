/**
* @name Freemoji
* @displayName Freemoji
* @description Send emoji external emoji and animated emoji without Nitro.
* @author Qb, An0
* @authorId 133659541198864384
* @license LGPLv3 - https://www.gnu.org/licenses/lgpl-3.0.txt
* @version 1.7.0
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
            name: 'Freemoji',
            authors: [
                {
                    name: 'Qb',
                    discord_id: '133659541198864384',
                    github_username: 'QbDesu'
                },
                {
                    name: 'An0',
                    github_username: 'An00nymushun'
                }
            ],
            version: '1.7.0',
            description: 'Send emoji external emoji and animated emoji without Nitro.',
            github: 'https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/Freemoji',
            github_raw: 'https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/Freemoji/Freemoji.plugin.js'
        },
        changelog: [
            { title: 'Features', types: 'added', items: ['Added an option to automatically split messages containing emoji links, enabled by default.'] },
            { title: 'Bug Fixes', types: 'fixed', items: ['Fixed "Allow" option for external emoji.'] }
        ],
        defaultConfig: [
            {
                type: 'switch',
                id: 'sendDirectly',
                name: 'Send Directly',
                note: 'Send the emoji link in a message directly instead of putting it in the chat box.',
                value: false
            },
            {
                type: 'switch',
                id: 'split',
                name: 'Automatically Split Emoji Messages',
                note: 'Automatically splits messages containing emoji links so there won\'t be links in the middle of your messages.',
                value: false
            },
            {
                type: 'slider',
                id: 'emojiSize',
                name: 'Emoji Size',
                note: 'The size of the emoji in pixels. 48 is recommended because it is the size of regular Discord emoji.',
                value: 48,
                markers: [32, 40, 48, 60, 64, 80, 96],
                stickToMarkers: true
            },
            {
                type: 'dropdown',
                id: 'removeGrayscale',
                name: 'Remove Grayscale Filter',
                note: 'Remove the grayscale filter on emoji that would normally not be usable.',
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
                type: 'dropdown',
                id: 'missingEmbedPerms',
                name: 'Missing Embed Perms Behaviour',
                note: 'What should happen if you select an emoji even though you have no embed permissions.',
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
                type: 'dropdown',
                id: 'external',
                name: 'Allow External Emoji',
                note: 'Allow External Emoji for servers that have them disabled.',
                value: 'showDialog',
                options: [
                    {
                        label: 'Don\'t Allow',
                        value: 'off'
                    },
                    {
                        label: 'Show Confirmation Dialog',
                        value: 'showDialog'
                    },
                    {
                        label: 'Allow',
                        value: 'allow'
                    }
                ]
            }
        ]
    };
    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        load() {
            BdApi.showConfirmationModal('Library plugin is needed',
                [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
                confirmText: 'Download',
                cancelText: 'Cancel',
                onConfirm: () => {
                    require('request').get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', async (error, response, body) => {
                        if (error) return require('electron').shell.openExternal('https://betterdiscord.app/Download?id=9');
                        await new Promise(r => require('fs').writeFile(require('path').join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body, r));
                        window.location.reload();
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
                    WebpackModules,
                    Toasts,
                    Logger,
                    DiscordModules: {
                        Permissions,
                        DiscordPermissions,
                        UserStore,
                        SelectedChannelStore,
                        ChannelStore,
                        DiscordConstants: {
                            EmojiDisabledReasons,
                            EmojiIntention
                        }
                    }
                } = Api;

                const Emojis = WebpackModules.findByUniqueProperties(['getDisambiguatedEmojiContext', 'searchWithoutFetchingLatest']);
                const EmojiParser = WebpackModules.findByUniqueProperties(['parse', 'parsePreprocessor', 'unparse']);
                const EmojiPicker = WebpackModules.findByUniqueProperties(['useEmojiSelectHandler']);
                const MessageUtilities = WebpackModules.getByProps("sendMessage");
                const EmojiFilter = WebpackModules.getByProps('getEmojiUnavailableReason');

                const EmojiPickerListRow = WebpackModules.find(m => m?.default?.displayName == 'EmojiPickerListRow');

                const SIZE_REGEX = /([?&]size=)(\d+)/;
                const EMOJI_SPLIT_LINK_REGEX = /(?:(?:^|\s)(?=https:\/\/cdn\.discordapp\.com\/emojis\/\d+\.(?:png|gif|webp)(?:\?size\=\d+&quality=\w)?))|(?:(?<=https:\/\/cdn\.discordapp\.com\/emojis\/\d+\.(?:png|gif|webp)(?:\?size\=\d+&quality=\w)?)(?:$|\s))/

                return class Freemoji extends Plugin {
                    currentUser = null;

                    replaceEmoji(text, emoji) {
                        const emojiString = `<${emoji.animated ? "a" : ""}:${emoji.originalName || emoji.name}:${emoji.id}>`;
                        const emojiURL = this.getEmojiUrl(emoji);
                        return text.replace(emojiString, emojiURL + " ");
                    }

                    patch() {
                        // make emote pretend locked emoji are unlocked
                        Patcher.after(Emojis, 'searchWithoutFetchingLatest', (_, args, ret) => {
                            ret.unlocked = ret.unlocked.concat(ret.locked);
                            ret.locked.length = [];
                            return ret;
                        });

                        // replace emoji with links in messages
                        Patcher.after(EmojiParser, 'parse', (_, args, ret) => {
                            for (const emoji of ret.invalidEmojis) {
                                ret.content = this.replaceEmoji(ret.content, emoji);
                            }
                            for (const emoji of ret.validNonShortcutEmojis) {
                                if (!emoji.available) {
                                    ret.content = this.replaceEmoji(ret.content, emoji);
                                }
                            }
                            if (this.settings.external) {
                                for (const emoji of ret.validNonShortcutEmojis) {
                                    if (this.getEmojiUnavailableReason(emoji) === EmojiDisabledReasons.DISALLOW_EXTERNAL) {
                                        ret.content = this.replaceEmoji(ret.content, emoji);
                                    }
                                }
                            }
                            return ret;
                        });

                        // override emoji picker to allow selecting emotes
                        Patcher.after(EmojiPicker, 'useEmojiSelectHandler', (_, args, ret) => {
                            const { onSelectEmoji, closePopout, selectedChannel } = args[0];
                            const self = this;

                            return function (data, state) {
                                if (state.toggleFavorite) return ret.apply(this, arguments);

                                const emoji = data.emoji;
                                const isFinalSelection = state.isFinalSelection;

                                if (self.getEmojiUnavailableReason(emoji, selectedChannel) === EmojiDisabledReasons.DISALLOW_EXTERNAL) {
                                    if (self.settings.external == 'off') return;

                                    if (self.settings.external == 'showDialog') {
                                        BdApi.showConfirmationModal(
                                            "Sending External Emoji",
                                            [`It looks like you are trying to send an an External Emoji in a server that would normally allow it. Do you still want to send it?`], {
                                            confirmText: "Send External Emoji",
                                            cancelText: "Cancel",
                                            onConfirm: () => {
                                                self.selectEmoji({ emoji, isFinalSelection, onSelectEmoji, selectedChannel, closePopout, disabled: true });
                                            }
                                        });
                                        return;
                                    }
                                    self.selectEmoji({ emoji, isFinalSelection, onSelectEmoji, closePopout, selectedChannel, disabled: true });
                                } else if (!emoji.available) {
                                    self.selectEmoji({ emoji, isFinalSelection, onSelectEmoji, closePopout, selectedChannel, disabled: true });
                                } else {
                                    self.selectEmoji({ emoji, isFinalSelection, onSelectEmoji, closePopout, selectedChannel, disabled: data.isDisabled });
                                }
                            }
                        });

                        Patcher.after(EmojiFilter, 'getEmojiUnavailableReason', (_, [{ intention, bypassPatch }], ret) => {
                            if (intention !== EmojiIntention.CHAT || bypassPatch || !this.settings.external) return;
                            return ret === EmojiDisabledReasons.DISALLOW_EXTERNAL ? null : ret;
                        });

                        Patcher.before(EmojiPickerListRow, 'default', (_, [{ emojiDescriptors }]) => {
                            if (this.settings.removeGrayscale == 'never') return;
                            if (this.settings.removeGrayscale != 'always' && !this.hasEmbedPerms()) return;
                            emojiDescriptors.filter(e => e.isDisabled).forEach(e => { e.isDisabled = false; e.wasDisabled = true; });
                        });
                        Patcher.after(EmojiPickerListRow, 'default', (_, [{ emojiDescriptors }]) => {
                            emojiDescriptors.filter(e => e.wasDisabled).forEach(e => { e.isDisabled = true; delete e.wasDisabled; });
                        });

                        Patcher.instead(MessageUtilities, 'sendMessage', (thisObj, args, originalFn) => {
                            if (!this.settings.split) return originalFn.apply(thisObj, args);
                            const [channel, message] = args;
                            const split = message.content.split(EMOJI_SPLIT_LINK_REGEX).map(s => s.trim()).filter(s => s.length);
                            if (split.length <= 1) return originalFn.apply(thisObj, args);


                            const promises = [];
                            for (let i = 0; i < split.length; i++) {
                                const text = split[i];
                                promises.push(new Promise((resolve, reject) => {
                                    window.setTimeout(() => {
                                        originalFn.call(thisObj, channel, { content: text, validNonShortcutEmojis: [] }).then(resolve).catch(reject);
                                    }, i * 100);
                                }));
                            }
                            return Promise.all(promises).then(ret => ret[ret.length - 1]);
                        });
                    }

                    selectEmoji({ emoji, isFinalSelection, onSelectEmoji, closePopout, selectedChannel, disabled }) {
                        if (disabled) {
                            const perms = this.hasEmbedPerms(selectedChannel);
                            if (!perms && this.settings.missingEmbedPerms == 'nothing') return;
                            if (!perms && this.settings.missingEmbedPerms == 'showDialog') {
                                BdApi.showConfirmationModal(
                                    "Missing Image Embed Permissions",
                                    [`It looks like you are trying to send an Emoji using Freemoji but you dont have the permissions to send embeded images in this channel. You can choose to send it anyway but it will only show as a link.`], {
                                    confirmText: "Send Anyway",
                                    cancelText: "Cancel",
                                    onConfirm: () => {
                                        if (this.settings.sendDirectly) {
                                            MessageUtilities.sendMessage(selectedChannel.id, { content: this.getEmojiUrl(emoji) });
                                        } else {
                                            onSelectEmoji(emoji, isFinalSelection);
                                        }
                                    }
                                });
                                return;
                            }
                            if (this.settings.sendDirectly) {
                                MessageUtilities.sendMessage(SelectedChannelStore.getChannelId(), { content: this.getEmojiUrl(emoji) });
                            } else {
                                onSelectEmoji(emoji, isFinalSelection);
                            }
                        } else {
                            onSelectEmoji(emoji, isFinalSelection);
                        }

                        if (isFinalSelection) closePopout();
                    }

                    getEmojiUnavailableReason(emoji, channel, intention) {
                        return EmojiFilter.getEmojiUnavailableReason({
                            channel: channel || ChannelStore.getChannel(SelectedChannelStore.getChannelId()),
                            emoji,
                            intention: EmojiIntention.CHAT || intention,
                            bypassPatch: true
                        })
                    }

                    getEmojiUrl(emoji) {
                        return emoji.url.includes("size=") ?
                            emoji.url.replace(SIZE_REGEX, `$1${this.settings.emojiSize}`) :
                            `${emoji.url}&size=${this.settings.emojiSize}`;
                    }

                    hasEmbedPerms(channelParam) {
                        try {
                            if (!this.currentUser) this.currentUser = UserStore.getCurrentUser();
                            const channel = channelParam || ChannelStore.getChannel(SelectedChannelStore.getChannelId());
                            if (!channel.guild_id) return true;
                            return Permissions.can(DiscordPermissions.EMBED_LINKS, this.currentUser.id, channel)
                        } catch (e) {
                            Logger.error("Error while detecting embed permissions", e);
                            return true;
                        }
                    }

                    cleanup() {
                        Patcher.unpatchAll();
                    }

                    onStart() {
                        try {
                            this.patch();
                        } catch (e) {
                            Toasts.error(`${config.info.name}: An error occured during intialiation: ${e}`);
                            Logger.error(`Error while patching: ${e}`);
                            console.error(e);
                        }
                    }

                    onStop() {
                        this.cleanup();
                    }

                    getSettingsPanel() { return this.buildSettingsPanel().getElement(); }
                };
            };
            return plugin(Plugin, Api);
        })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
