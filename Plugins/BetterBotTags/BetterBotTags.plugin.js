/**
* @name BetterBotTags
* @description Some improvements for bot tags, like the addition of webhook tags.
* @author Qb, Ben855
* @authorId 133659541198864384
* @version 1.1.0
* @invite gj7JFa6mF8
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/BetterBotTags
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/BetterBotTags/BetterBotTags.plugin.js
* @license MIT
*/
/*@cc_on
@if (@_jscript)

var shell = WScript.CreateObject("WScript.Shell");
shell.Popup("It looks like you've mistakenly tried to run me directly. That's not how you install plugins. \n(So don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);


@else@*/

module.exports = (() => {
    const config = {
        info: {
            name: "BetterBotTags",
            version: "1.1.0",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/BetterBotTags/BetterBotTags.plugin.js"
        },
        changelog: [
            { 
                title: 'Bug Fixes', types: 'fixed', items: [
                    'Fixed compilation error caused by a recent discord update breaking stuff.',
                    'Fixed webhook tag not being displayed unless the user opened the settings of any server'
                ],
            },
            { 
                title: 'Changes', types: 'changed', items: [
                    'As a side-effect of other fixes the clyde tag won\'t be displayed in DMs anymore. Im thinking of removing it entirely.',
                ],
            }
        ],
        defaultConfig: [
            {
                type: "switch",
                id: "icons",
                name: "Icons",
                note: "Show icons on bot tags",
                value: true
            },
            {
                type: "switch",
                id: "labels",
                name: "Text Labels",
                note: "Show text label on bot tags",
                value: true
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
                    DiscordModules: {
                        React
                    },
                    Patcher,
                    WebpackModules,
                    Utilities,
                } = Api;

                const MessageHeader = WebpackModules.find(m => m.default.displayName == "MessageHeader")
                const NewMemberBadge = WebpackModules.find(m => m.default.displayName == "NewMemberBadge");
                const BotTag = WebpackModules.getByProps("BotTagTypes");
                const BotTagTypes = { ...(BotTag?.default?.Types || BotTag?.BotTagTypes || []), WEBHOOK: 13, CLYDE: 12, 13: "WEBHOOK", 12: "CLYDE" };
                const botTagClasses = WebpackModules.getByProps("botTagCozy");
                const DiscordTag = WebpackModules.find(m => m.default.displayName === "DiscordTag");
                const WebhookIcon = (props) => React.createElement(
                    "svg",
                    {
                        className: `${config.info.name}--webhook-icon`,
                        viewBox: "0 0 24 24",
                        width: props.width,
                        height: props.height
                    },
                    React.createElement("path", {
                        d: "M11 10.9C11 10.9 11 10.9 11 10.9V8.82929C9.83481 8.41746 9 7.30622 9 6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6H17C17 3.23858 14.7614 1 12 1C9.23858 1 7 3.23858 7 6C7 7.79499 7.94587 9.36906 9.36637 10.251L6.29491 16.0216C6.19867 16.0074 6.1002 16 6 16C4.89543 16 4 16.8954 4 18C4 19.1046 4.89543 20 6 20C6.82012 20 7.52495 19.5064 7.83358 18.8H16.1664C16.475 19.5064 17.1799 20 18 20C19.1046 20 20 19.1046 20 18C20 16.8954 19.1046 16 18 16C17.1799 16 16.475 16.4936 16.1664 17.2H7.83359C7.82844 17.1882 7.82318 17.1765 7.81781 17.1648L11 10.9Z",
                        fill: props.color || "currentColor"
                    }),
                    React.createElement("path", {
                        d: "M12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6C14 6.43529 13.8609 6.8381 13.6248 7.16643L18 13C20.7614 13 23 15.2386 23 18C23 20.7614 20.7614 23 18 23C15.9497 23 14.1876 21.7659 13.416 20H15.7639C16.3132 20.6138 17.1115 21 18 21C19.6568 21 21 19.6569 21 18C21 16.3431 19.6568 15 18 15H17L12 8Z",
                        fill: props.color || "currentColor"
                    }),
                    React.createElement("path", {
                        d: "M10.584 20C9.8124 21.7659 8.05032 23 6 23C3.23858 23 1 20.7614 1 18C1 15.2386 3.23858 13 6 13V15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21C6.8885 21 7.68679 20.6138 8.23611 20H10.584Z",
                        fill: props.color || "currentColor"
                    })
                );
                const RobotIcon = WebpackModules.getByDisplayName("Robot");
                const DiscordIcon = WebpackModules.getByDisplayName("Discord");

                return class extends Plugin {
                    constructor() {
                        super();
                        // remove need for duplication of metadata fields
                        this.getAuthor = null;
                        this.getDescription = null;
                    }

                    patch() {
                        Patcher.after(MessageHeader, "default", (_, [{ message }], res) => {
                            if (!message) return;
                            if (!this.isClyde(message) && this.isWebhook(message)){
                                // Prevent the original bot tag from being displayed for webhooks
                                message.author.bot = false;
                            }
                        });
                        Patcher.after(NewMemberBadge, "default", (_, [{ message }], res) => {
                            if (!message) return;
                            
                            // add bot tags to clyde and webhook messages
                            if (this.isClyde(message)) {
                                return React.createElement(React.Fragment, null,
                                    React.createElement(BotTag.default, {
                                        type: BotTagTypes.CLYDE,
                                        verified: false,
                                        useRemSizes: false,
                                        className: `${botTagClasses.botTagCozy} ${botTagClasses.botTagCompact}`
                                    }),
                                    res
                                )
                            } else if (this.isWebhook(message)) {
                                return React.createElement(React.Fragment, null,
                                    React.createElement(BotTag.default, {
                                        type: BotTagTypes.WEBHOOK,
                                        verified: false,
                                        useRemSizes: true,
                                        className: `${botTagClasses.botTagCozy} ${botTagClasses.botTagCompact}`
                                    }),
                                    res
                                )
                            }
                        });

                        Patcher.after(BotTag, "default", (_, [{ type }], res) => {
                            if (type == null) type=BotTagTypes.BOT;

                            res.props.className = `${res.props.className} ${config.info.name}--tag ${config.info.name}--${BotTagTypes[type]}`;
                            const label = Utilities.findInReactTree(res, e => typeof e?.children === "string");

                            if (label) {
                                if (this.settings.labels) {
                                    if (type == BotTagTypes.WEBHOOK) {
                                        label.children = "WEBHOOK";
                                    } else if (type == BotTagTypes.CLYDE) {
                                        label.children = "CLYDE";
                                    }
                                    label.children = ` ${label.children}`;
                                } else {
                                    label.children = "";
                                }
                            }

                            if (this.settings.icons) {
                                if (type == BotTagTypes.WEBHOOK) {
                                    res.props.children.unshift(React.createElement(WebhookIcon, { height: "16", width: "16" }));
                                } else if (type == BotTagTypes.CLYDE) {
                                    res.props.children.unshift(React.createElement(DiscordIcon, { height: "16", width: "16" }));
                                } else if (type == BotTagTypes.BOT) {
                                    res.props.children.unshift(React.createElement(RobotIcon, { height: "16", width: "16" }));
                                } else if (type == BotTagTypes.OFFICIAL) {
                                    res.props.children.unshift(React.createElement(DiscordIcon, { height: "16", width: "16" }));
                                }
                            }

                        });

                        Patcher.after(DiscordTag, "default", (_, [{ user, hideDiscriminator }], res) => {
                            if (hideDiscriminator && user?.bot && user.discriminator == "0000") {
                                if (this.isClyde(user)) {
                                    res.props.botType = BotTagTypes.CLYDE;
                                } else {
                                    res.props.botType = BotTagTypes.WEBHOOK;
                                }
                            }
                        });
                    }

                    isClyde(message) { return message.author.id === "1" && message.author.username === "Clyde"; }
                    isWebhook(message) { return message.webhookId && !message.messageReference && message.author.discriminator == "0000"; }

                    unpatch() {
                        Patcher.unpatchAll();
                    }

                    onStart() {
                        if(!BotTag) return BdApi.showToast(`${config.info.name}: Failed to resolve BotTag Module`, { type: "error" });
                        this.patch();
                    }

                    onStop() {
                        this.unpatch();
                    }

                    getSettingsPanel() {
                        return this.buildSettingsPanel().getElement();
                    }
                };
            };
            return plugin(Plugin, Api);
        })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
