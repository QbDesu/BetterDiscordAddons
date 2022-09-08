/**
* @name Freemoji
* @displayName Freemoji - Discontinued
* @description Send emoji external emoji and animated emoji without Nitro.
* @author Qb, An0
* @authorId 133659541198864384
* @license LGPLv3 - https://www.gnu.org/licenses/lgpl-3.0.txt
* @version 1.8.0
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/Freemoji
*/
/*@cc_on
@if (@_jscript)

var shell = WScript.CreateObject("WScript.Shell");
shell.Popup("It looks like you've mistakenly tried to run me directly. That's not how you install plugins. \n(So don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);

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
            version: '1.8.0',
            description: 'Send emoji external emoji and animated emoji without Nitro. - Discontinued as of September 8th, 2022',
            github: 'https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/Freemoji'
        },
        changelog: [
            { title: 'Discontinuation', types: 'fixed', items: ['The plugin was discontinued and will receive no further updates.'] },
            { title: 'Features', types: 'added', items: [
                'Message splitting was reworked and now has more options thanks to FrostBird347',
                'A much requested option to replace the WebP file extension with PNG was added, also thanks to FrostBird347'
            ] }
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
                id: 'splitDelay',
                name: 'Split Message Delay',
                note: 'The delay between each split message in ms.',
                value: 100,
                markers: [50, 100, 150, 200, 250, 500, 750, 1000],
                stickToMarkers: true,
                defaultValue: 100
            },
            {
                type: 'switch',
                id: 'splitDelaySlowdown',
                name: 'Add Slowdown Time',
                note: 'Adds the current slowmode time to the split message delay.',
                value: true
            },
            {
                type: 'slider',
                id: 'splitLimit',
                name: 'Split Message Limit',
                note: 'Prevent the user from sending more than this many split messages at once. This setting and the one below is disabled if the value is set to zero.',
                value: 6,
                markers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                stickToMarkers: true,
                defaultValue: 6
            },
            {
                type: 'dropdown',
                id: 'splitLimitMode',
                name: 'Split Message Limit Mode',
                note: 'What should happen to the rest of a message once the limit in the setting above is reached?',
                value: true,
                options: [
                    {
                        label: 'Send all the remaining text in one message',
                        value: false
                    },
                    {
                        label: 'Put the text back inside the message box',
                        value: true
                    }
                ]
            },
            {
                type: 'slider',
                id: 'emojiSize',
                name: 'Emoji Size',
                note: 'The size of the emoji in pixels. 48 is recommended because it is the size of regular Discord emoji.',
                value: 48,
                markers: [32, 40, 44, 48, 56, 60, 64, 80, 96],
                defaultValue: 48,
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
            },
            {
                type: 'switch',
                id: 'replacePNG',
                name: 'Use PNG instead of WEBP',
                note: 'If the emoji url points to a webp image, replace it with a png',
                value: false
            }
        ]
    };
    return !global.ZeresPluginLibrary ? class {
        constructor() {
            BdApi.showConfirmationModal("Library plugin is needed",
                [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => {
                            require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r);
                            window.location.reload();
                        });
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
                    Utilities,
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
                const ComponentDispatch = WebpackModules.getByProps("ComponentDispatch")?.ComponentDispatch;

                const Emojis = WebpackModules.findByUniqueProperties(['getDisambiguatedEmojiContext', 'searchWithoutFetchingLatest']);
                const EmojiParser = WebpackModules.findByUniqueProperties(['parse', 'parsePreprocessor', 'unparse']);
                const EmojiPicker = WebpackModules.findByUniqueProperties(['useEmojiSelectHandler']);
                const MessageUtilities = WebpackModules.getByProps("sendMessage");
                const EmojiFilter = WebpackModules.getByProps('getEmojiUnavailableReason');

                const EmojiPickerListRow = WebpackModules.find(m => m?.default?.displayName == 'EmojiPickerListRow');

                const SIZE_REGEX = /([?&]size=)(\d+)/;
                const EMOJI_SPLIT_LINK_REGEX = /(https:\/\/cdn\.discordapp\.com\/emojis\/\d+\.(?:png|gif|webp)(?:\?size\=\d+&quality=\w*)?)/

                return class Freemoji extends Plugin {
                    currentUser = null;
                    
                    constructor() {
                        super(...arguments);

                        (window||globalThis).setTimeout(() => {
                            if (!Utilities.loadData(this.getName(), "discontinuationNoticeDismissed", false)) {
                                BdApi.showConfirmationModal("Discontinuation", `## As of September 8th, 2022 the Freemoji plugin is discontinued. The plugin will not receive any further updates - if it breaks it stays broken.

The main reason for that is my disappointment and disgust upon seeing some of the reactions and hate coming from the community following the recent guideline updates and the discontinuation of the ShowHiddenChannels plugin. The reason is not the updated guidelines, but the obnoxious community.
                        
## You can read more details about that here: https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/Freemoji/DISCONTINUATION.md
                        
You may choose to **delete the plugin now** or **dismiss this notice to not be bothered again** and continue using it.`, {
                                    danger:true,
                                    onCancel: ()=>{Utilities.saveData(this.getName(), "discontinuationNoticeDismissed", true);},
                                    cancelText:"Dismiss, and continue using Freemoji",
                                    onConfirm: ()=>{require("fs").unlinkSync(require("path").join(BdApi.Plugins.folder, "Freemoji.plugin.js"));},
                                    confirmText: "Delete"
                                });
                            }
                        }, 1000);
                    }

                    replaceEmoji(text, emoji) {
                        const emojiString = `<${emoji.animated ? "a" : ""}:${emoji.originalName || emoji.name}:${emoji.id}>`;
                        const emojiURL = this.getEmojiUrl(emoji);
                        return text.replace(emojiString, emojiURL + " ");
                    }

                    patch() {
                        // make emote pretend locked emoji are unlocked
                        Emojis?.searchWithoutFetchingLatest &&
                        Patcher.after(Emojis, 'searchWithoutFetchingLatest', (_, args, ret) => {
                            try {
                                ret.unlocked = ret.unlocked.concat(ret.locked);
                                ret.locked.length = [];
                                return ret;
                            } catch(_) {}
                        });

                        // replace emoji with links in messages
                        (EmojiParser?.parse || Logger.error("EmojiParser?.parse")) &&
                        Patcher.after(EmojiParser, 'parse', (_, args, ret) => {
                            try {
                                for (const emoji of ret.invalidEmojis) {
                                    ret.content = this.replaceEmoji(ret.content, emoji);
                                }
                                ret.invalidEmojis = [];

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
                            } catch(_) {}
                        });

                        // override emoji picker to allow selecting emotes
                        (EmojiPicker?.useEmojiSelectHandler || Logger.error("EmojiPicker?.useEmojiSelectHandler")) &&
                        Patcher.after(EmojiPicker, 'useEmojiSelectHandler', (_, args, ret) => {
                            try {
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
                            } catch(_) {}
                        });

                        (EmojiFilter?.getEmojiUnavailableReason || Logger.error("EmojiFilter?.getEmojiUnavailableReason")) &&
                        Patcher.after(EmojiFilter, 'getEmojiUnavailableReason', (_, [{ intention, bypassPatch }], ret) => {
                            try {
                                if (intention !== EmojiIntention.CHAT || bypassPatch || !this.settings.external) return;
                                return ret === EmojiDisabledReasons.DISALLOW_EXTERNAL ? null : ret;
                            } catch(_) {}
                        });

                        EmojiPickerListRow?.default &&
                        Patcher.before(EmojiPickerListRow, 'default', (_, [{ emojiDescriptors }]) => {
                            try {
                                if (this.settings.removeGrayscale == 'never') return;
                                if (this.settings.removeGrayscale != 'always' && !this.hasEmbedPerms()) return;
                                emojiDescriptors.filter(e => e.isDisabled).forEach(e => { e.isDisabled = false; e.wasDisabled = true; });
                            } catch(_) {}
                        });
                        EmojiPickerListRow?.default &&
                        Patcher.after(EmojiPickerListRow, 'default', (_, [{ emojiDescriptors }]) => {
                            try {
                                emojiDescriptors.filter(e => e.wasDisabled).forEach(e => { e.isDisabled = true; delete e.wasDisabled; });
                            } catch(_) {}
                        });

                        //Prevent know bug causing duplicate messages due to an interaction with EmoteReplacer
                        BdApi.Plugins.isEnabled("EmoteReplacer") ||
                        (MessageUtilities?.sendMessage &&
                        Patcher.instead(MessageUtilities, 'sendMessage', (thisObj, args, originalFn) => {
                            try {
                                if (!this.settings.split || BdApi.Plugins.isEnabled("EmoteReplacer")) return originalFn.apply(thisObj, args);
                                const [channel, message] = args;
                                const split = message.content.split(EMOJI_SPLIT_LINK_REGEX).map(s => s.trim()).filter(s => s.length);
                                if (split.length <= 1) return originalFn.apply(thisObj, args);

                                const promises = [];
                                const rateLimit = ChannelStore.getChannel(SelectedChannelStore.getChannelId())?.rateLimitPerUser || 0;
                                const splitDelay = rateLimit * 1000 + this.settings.splitDelay;

                                for (let i = 0; i < split.length; i++) {
                                    const text = [split[i]];
                                    if (this.settings.splitLimit != 0 && i > this.settings.splitLimit - 1) {
                                        i++;
                                        while (i < split.length) {
                                            text.push(split[i]);
                                            i++;
                                        }
                                    }

                                    if (i == 0 && args[3].messageReference != undefined) {
                                        var firstMessage = message;
                                        firstMessage.content = text.join('\n').trim();
                                        args.message = firstMessage;
                                        originalFn.apply(thisObj, args);
                                        continue;
                                    }

                                    if (text.join('\n').trim() != "") {
                                        if (this.settings.splitLimitMode && i > this.settings.splitLimit - 1) {
                                            setTimeout(() => {
                                                ComponentDispatch.dispatch("INSERT_TEXT", {
                                                    plainText: text.join('\n').trim()
                                                })
                                            }, this.settings.splitLimit * splitDelay);

                                        } else {
                                            promises.push(new Promise((resolve, reject) => {
                                                window.setTimeout(() => {
                                                    originalFn.call(thisObj, channel, { content: text.join('\n').trim(), validNonShortcutEmojis: [] }).then(resolve).catch(reject);
                                                }, i * splitDelay);
                                            }));
                                        }
                                    }
                                }
                                return Promise.all(promises).then(ret => ret[ret.length - 1]);
                            } catch(_) {}
                        }));
                    }

                    selectEmoji({ emoji, isFinalSelection, onSelectEmoji, closePopout, selectedChannel, disabled }) {
                        try {
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
                        } catch (e) {
                            Logger.error("An error occured while trying to select the emoji.", e);
                            return true;
                        }
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
                        try {
                            let finalEmojiURL = emoji.url;
                            if (this.settings.replacePNG) {
                                finalEmojiURL = finalEmojiURL.replace(".webp?", ".png?");
                            }
                            return finalEmojiURL.includes("size=") ?
                                finalEmojiURL.replace(SIZE_REGEX, `$1${this.settings.emojiSize}`) :
                                `${finalEmojiURL}&size=${this.settings.emojiSize}`;
                        } catch(e) {
                            Logger.error("Error while getting emoji url, enjoy :zerezoom: instead.", e);
                            return `https://cdn.discordapp.com/emojis/767805326807924746.webp?quality=lossless&size=${this.settings.emojiSize}`;
                        } 
                    }

                    hasEmbedPerms(channelParam) {
                        try {
                            if (!this.currentUser) this.currentUser = UserStore.getCurrentUser();
                            const channel = channelParam || ChannelStore.getChannel(SelectedChannelStore.getChannelId());
                            if (!channel.guild_id) return true;
                            return Permissions.can({ permission: DiscordPermissions.EMBED_LINKS, user: this.currentUser.id, context: channel });
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
