/**
* @name RemoveChatButtons
* @displayName RemoveChatButtons
* @description Remove annoying buttons like the Gift button from the chat box.
* @author Qb
* @authorId 133659541198864384
* @version 1.1.1
* @invite gj7JFa6mF8
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/RemoveChatButtons
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/RemoveChatButtons/RemoveChatButtons.plugin.js
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
            name: "RemoveChatButtons",
            authors: [
                {
                    name: "Qb",
                    discord_id: "133659541198864384",
                    github_username: "QbDesu"
                }
            ],
            version: "1.1.1",
            description: "Remove annoying buttons like the Gift button from the chat box.",
            github: "https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/RemoveChatButtons",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/RemoveChatButtons/RemoveChatButtons.plugin.js"
        },
        defaultConfig: [
            {
                type: "switch",
                id: "giftButton",
                name: "Remove Gift Button",
                note: "Removes the Gift Nitro button from the chat.",
                value: true,
            },
            {
                type: "switch",
                id: "gifButton",
                name: "Remove GIF Button",
                note: "Removes the GIF button from the chat.",
                value: true,
            },
            {
                type: "switch",
                id: "stickerButton",
                name: "Remove Sticker Button",
                note: "Removes the Sticker button from the chat.",
                value: true,
            },
            {
                type: "switch",
                id: "emojiButton",
                name: "Remove Emoji Button",
                note: "Removes the Emoji button from the chat.",
                value: false,
            },
            {
                type: "switch",
                id: "attachButton",
                name: "Attach Button",
                note: "Removes the Attach button from the chat.",
                value: false,
            },
            {
                type: "switch",
                id: "cssOnly",
                name: "CSS-Only Mode",
                note: "This is useful in case there is incompatibilities with plugins or themes.",
                value: false,
            }
        ],
        changelog: [
            {
                title: "Bug Fixes", type: "fixed", items: [
                    "Fixed CSS-only mode not working for GIF and Gift buttons."
                ]
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
                    DOMTools,
                    WebpackModules,
                    PluginUtilities,
                    Logger,
                    DiscordModules
                } = Api;

                // thanks to Strencher for pointing out these modules
                const ChannelTextAreaContainer = WebpackModules.find(m => m?.type?.render?.displayName === "ChannelTextAreaContainer")?.type;
                //const ChannelPremiumGiftButton = WebpackModules.find(m => m.type.displayName === "ChannelPremiumGiftButton")?.type;
                const ChannelGIFPickerButton = WebpackModules.find(m => m.type.render.displayName === "ChannelGIFPickerButton")?.type;
                const ChannelEmojiPicker = WebpackModules.find(m => m.type.render.displayName === "ChannelEmojiPicker")?.type;
                const ChannelStickerPickerButton = WebpackModules.find(m => m.type.render.displayName === "ChannelStickerPickerButton")?.type;

                const {PREMIUM_GIFT_BUTTON_LABEL, GIF_BUTTON_LABEL} = WebpackModules.getByProps("PREMIUM_GIFT_BUTTON_LABEL");

                const buttonClasses = WebpackModules.getByProps("emojiButton", "stickerButton");
                const channelTextAreaSelector = new DOMTools.Selector(buttonClasses.channelTextArea);
                const emojiButtonSelector = new DOMTools.Selector(buttonClasses.emojiButton);
                const stickerButtonSelector = new DOMTools.Selector(buttonClasses.stickerButton);
                const attachButtonSelector = new DOMTools.Selector(buttonClasses.attachButton);
                const getCssKey = name => `${config.info.name}--${name}`;
                const getCssRule = child => `${channelTextAreaSelector} ${child} { display: none; }`;

                return class RemoveChatButtons extends Plugin {
                    hideGiftKey = getCssKey("hideGiftButton");
                    hideGifKey = getCssKey("hideGifButton");
                    hideEmojiKey = getCssKey("hideEmojiButton");
                    hideStickerKey = getCssKey("hideStickerButton");
                    hideAttachKey = getCssKey("hideAttachButton");
                    //
                    hideEmojiButtonCss = getCssRule(emojiButtonSelector);
                    hideStickerButtonCss = getCssRule(stickerButtonSelector);
                    hideAttachButtonCss = getCssRule(attachButtonSelector);

                    addStyles() {
                        if (this.settings.cssOnly) {
                            if (this.settings.giftButton) {
                                PluginUtilities.addStyle(
                                    this.hideGiftKey,
                                    getCssRule(`[aria-label="${PREMIUM_GIFT_BUTTON_LABEL}"]`)
                                )
                            }
                            if (this.settings.gifButton) {
                                PluginUtilities.addStyle(
                                    this.hideGifKey,
                                    getCssRule(`[aria-label="${GIF_BUTTON_LABEL}"]`)
                                )
                            }
                            if (this.settings.emojiButton) PluginUtilities.addStyle(this.hideEmojiKey, this.hideEmojiButtonCss);
                            if (this.settings.stickerButton) PluginUtilities.addStyle(this.hideStickerKey, this.hideStickerButtonCss);
                            if (this.settings.attachButton) PluginUtilities.addStyle(this.hideAttachKey, this.hideAttachButtonCss);
                        }
                    }

                    patch() {
                        Patcher.before(ChannelTextAreaContainer, "render", (_, [props]) => {
                            if (!this.settings.cssOnly && this.settings.giftButton) props.shouldRenderPremiumGiftButton = false;
                            if (!this.settings.cssOnly && this.settings.attachButton) props.renderAttachButton = () => { };
                        });
                        Patcher.after(ChannelGIFPickerButton, "render", (_, args, ret) => {
                            return !this.settings.cssOnly && this.settings.gifButton ? null : ret;
                        });
                        Patcher.after(ChannelEmojiPicker, "render", (_, args, ret) => {
                            return !this.settings.cssOnly && this.settings.emojiButton ? null : ret;
                        });
                        Patcher.after(ChannelStickerPickerButton, "render", (_, args, ret) => {
                            return !this.settings.cssOnly && this.settings.stickerButton ? null : ret;
                        });
                    }

                    cleanup() {
                        Patcher.unpatchAll();
                        this.removeStyles();
                    }

                    removeStyles() {
                        PluginUtilities.removeStyle(this.hideGiftKey);
                        PluginUtilities.removeStyle(this.hideGifKey);
                        PluginUtilities.removeStyle(this.hideEmojiKey);
                        PluginUtilities.removeStyle(this.hideStickerKey);
                        PluginUtilities.removeStyle(this.hideAttachKey);
                    }

                    onStart() {
                        try {
                            this.patch();
                        } catch (e) {
                            Toasts.warn(`${config.info.name}: An error occured during intialiation, falling back to CSS-Only mode.`);
                            Logger.error(`Error while patching: ${e}`);
                            console.error(e);
                            this.settings.cssOnly = true;
                            Patcher.unpatchAll();
                        }
                        this.addStyles();
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
