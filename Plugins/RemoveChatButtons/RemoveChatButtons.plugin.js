/**
* @name RemoveChatButtons
* @displayName RemoveChatButtons
* @description Remove annoying buttons like the Gift button from the chat box.
* @author Qb
* @authorId 133659541198864384
* @version 1.3.2
* @invite gj7JFa6mF8
* @source https://github.com/BleedingBD/plugin-RemoveChatButtons
* @updateUrl https://raw.githubusercontent.com/BleedingBD/plugin-RemoveChatButtons/main/RemoveChatButtons.plugin.js
*/
/*@cc_on
@if (@_jscript)

var shell = WScript.CreateObject("WScript.Shell");
shell.Popup("It looks like you've mistakenly tried to run me directly. That's not how you install plugins. \n(So don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);

@else@*/
class Styler {
    pluginName = "";
    styles = new Set();
    index = 0;

    constructor(pluginName) {
        this.pluginName = pluginName;
    }

    /**
     * Add a stylesheet to the document.
     * @param name The name of the stylesheet, can be used to remove it later.
     * @param style The css string to add as a stylesheet.
     * @returns A function that removes the stylesheet from the document.
     */
    add(name, style) {
        if (!style) {
            style = name;
            name = `${this.index++}`;
        }
        const key = `${this.pluginName}--Styler--${name}`;
        BdApi.injectCSS(key, style);
        this.styles.add(key);
        return () => {
            this.remove(name);
        };
    }

    /**
     * Remove a stylesheet with the given name from the document.
     * @param name The name of the stylesheet to remove.
     */
    remove(name) {
        const key = `${this.pluginName}--Styler--${name}`;
        BdApi.clearCSS(key);
        this.styles.delete(key);
    }

    /**
     * Remove all stylesheets that were added by this Styler instance from the document.
     */
    removeAll() {
        for (const key of this.styles) {
            BdApi.clearCSS(key);
        }
        this.styles.clear();
        this.index = 0;
    }
}

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
            version: "1.3.2",
            description: "Remove annoying buttons like the Gift button from the chat box.",
            github: "https://github.com/BleedingBD/plugin-RemoveChatButtons",
            github_raw: "https://raw.githubusercontent.com/BleedingBD/plugin-RemoveChatButtons/main/RemoveChatButtons.plugin.js"
        },
        defaultConfig: [
            {
                type: "switch",
                id: "giftButton",
                name: "Remove Gift/Boost Button",
                note: "Removes the Gift Nitro/Boost Server button from the chat.",
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
                type: "category",
                name: "Direct Messages",
                id: "dms",
                settings: [
                    {
                        type: "switch",
                        name: "Friends Tab",
                        note: "Removes the friends tab button from the DM list.",
                        id: "friendsTab",
                        value: false
                    },
                    {
                        type: "switch",
                        name: "Nitro Tab",
                        note: "Removes the nitro tab button from the DM list.",
                        id: "premiumTab",
                        value: true
                    }
                ]
            }
        ],
        changelog: [
            {
                title: "Fixes", type: "fixed", items: [
                    "Partial rewrite. Everything should work again."
                ]
            },
            {
                title: "Changes", type: "changed", items: [
                    "Moved to a new GitHub repo."
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
                    DiscordModules: { LocaleManager },
                    DOMTools,
                    Logger,
                    PluginUtilities,
                    WebpackModules
                } = Api;
                
                const Messages = WebpackModules.getByProps("PREMIUM_GIFT_BUTTON_LABEL");

                const buttonClasses = WebpackModules.getByProps("emojiButton", "stickerButton");
                const channelTextAreaSelector = new DOMTools.Selector(buttonClasses.channelTextArea);
                const emojiButtonSelector = new DOMTools.Selector(buttonClasses.emojiButton);
                const stickerButtonSelector = new DOMTools.Selector(buttonClasses.stickerButton);
                const attachButtonSelector = new DOMTools.Selector(buttonClasses.attachButton);

                const privateChannelsClass = WebpackModules.getByProps("privateChannels")?.privateChannels

                const getCssRule = selector => `${selector} { display: none; }`;
                const getTextAreaCssRule = child => `${channelTextAreaSelector||""} ${child} { display: none; }`;

                return class RemoveChatButtons extends Plugin {
                    styler = new Styler(config.info.name);

                    constructor() {
                        super();
                        this.refreshLocaleFn = this.refreshLocaleFn.bind(this);
                    }

                    addStyles() {
                        if (Messages) {
                            const {PREMIUM_GIFT_BUTTON_LABEL, GIF_BUTTON_LABEL, PREMIUM_GUILD_BOOST_THIS_SERVER} = Messages;
                        
                            if (this.settings.giftButton) {
                                this.styler.add(
                                    `
                                    ${getTextAreaCssRule(`[aria-label="${PREMIUM_GIFT_BUTTON_LABEL}"]`)}
                                    ${getTextAreaCssRule(`[aria-label="${PREMIUM_GUILD_BOOST_THIS_SERVER}"]`)}
                                    `
                                );
                            }
                            if (this.settings.gifButton) this.styler.add(getTextAreaCssRule(`[aria-label="${GIF_BUTTON_LABEL}"]`));
                        } else {
                            Logger.warn("Messages not found!")
                        }
                        if (this.settings.emojiButton) this.styler.add(getTextAreaCssRule(emojiButtonSelector));
                        if (this.settings.stickerButton) this.styler.add(getTextAreaCssRule(stickerButtonSelector));
                        if (this.settings.attachButton) this.styler.add(getTextAreaCssRule(attachButtonSelector));

                        if (this.settings.dms.friendsTab) this.styler.add(getCssRule(`.${privateChannelsClass} [href="/channels/@me"]`));
                        if (this.settings.dms.premiumTab) this.styler.add(getCssRule(`.${privateChannelsClass} [href="/store"]`));
                    }

                    removeStyles() {
                        PluginUtilities.removeStyle(this.hideGiftKey);
                        PluginUtilities.removeStyle(this.hideGifKey);
                        PluginUtilities.removeStyle(this.hideEmojiKey);
                        PluginUtilities.removeStyle(this.hideStickerKey);
                        PluginUtilities.removeStyle(this.hideAttachKey);
                    }

                    refreshStyles() {
                        this.styler.removeAll();
                        this.addStyles();
                        Logger.info("Refreshed styles.")
                    }

                    refreshLocaleFn() {
                        // Doesn't seem to work... Messages still holds the old value for some reason.
                        // Keeping this anyway for now.
                        setTimeout(this.refreshStyles(), 1000);
                    }

                    onStart() {
                        this.addStyles();
                        LocaleManager.on("locale", this.refreshLocaleFn);
                    }

                    onStop() {
                        this.styler.removeAll();
                        LocaleManager.off("locale", this.refreshLocaleFn);
                    }

                    getSettingsPanel() {
                        const panel = this.buildSettingsPanel();
                        panel.addListener(() => {
                            this.refreshStyles();
                        });
                        return panel.getElement();
                    }
                };
            };
            return plugin(Plugin, Api);
        })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
