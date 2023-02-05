/**
* @name BetterBotTags
* @description Some improvements for bot tags, like the addition of webhook tags.
* @author Qb
* @authorId 133659541198864384
* @version 2.0.1
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
            version: "2.0.1",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/BetterBotTags/BetterBotTags.plugin.js"
        },
        changelog: [
            {
                title: 'Bug Fixes', types: 'fixed', items: [
                    'Fixed missing padding in replies and compact display.',
                    'Fixed surplus space when icons are disabled.',
                ],
            },
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
                    Logger
                } = Api;
                const {
                    Patcher,
                    React,
                    Webpack: { Filters, getModule }
                } = new BdApi(config.info.name);

                const getModuleAndKey = (filter) => {
                    let module;
                    const value = getModule((e, m) => filter(e) ? (module = m) : false, { searchExports: true });
                    if (!module) return;
                    return [module.exports, Object.keys(module.exports).find(k => module.exports[k] === value)];
                };

                
                const MessageHeader = getModuleAndKey(Filters.byStrings(".message",".compact", ".author", ".showPopout"));
                const BotTag = getModuleAndKey(Filters.combine(Filters.byProps("Types"), Filters.byStrings(".BOT")));

                const BotTagTypes = { 
                    0: "BOT",
                    1: "SYSTEM_DM",
                    2: "WEBHOOK",
                    3: "OFFICIAL",
                    4: "SERVER",
                    5: "ORIGINAL_POSTER",
                    BOT: 0,
                    SYSTEM_DM: 1,
                    WEBHOOK: 2,
                    OFFICIAL: 3,
                    SERVER: 4,
                    ORIGINAL_POSTER: 5
                };
                const MessageTypes = getModule(Filters.byProps("DEFAULT","RECIPIENT_ADD"), { searchExports: true })

                const BotIcon = (props) => React.createElement(
                    "svg",
                    {
                        className: `${config.info.name}--BotTag--Icon--icon ${config.info.name}--BotTag--Icon--Bot`,
                        viewBox: "0 0 24 24",
                        width: props.width,
                        height: props.height,
                        role: "img",
                        "aria-hidden": "true"
                    },
                    React.createElement("path", {
                        d: "M12 2C14.761 2 17 4.238 17 7V9H7V7C7 4.238 9.238 2 12 2ZM10.5 5.5C10.5 6.329 11.172 7 12 7C12.828 7 13.5 6.329 13.5 5.5C13.5 4.671 12.828 4 12 4C11.172 4 10.5 4.671 10.5 5.5ZM23 22H17L19 19V12H17V18C17 18.553 16.552 19 16 19H14L15 22H9L10 19H8C7.448 19 7 18.553 7 18V12H5V19L7 22H1L3 19V12C3 10.896 3.897 10 5 10H19C20.103 10 21 10.896 21 12V19L23 22ZM13 14C13 14.553 13.448 15 14 15C14.552 15 15 14.553 15 14C15 13.447 14.552 13 14 13C13.448 13 13 13.447 13 14Z",
                        fill: props.color || "currentColor"
                    })
                );
                const WebhookIcon = (props) => React.createElement(
                    "svg",
                    {
                        className: `${config.info.name}--BotTag--Icon--icon ${config.info.name}--BotTag--Icon--Webhook`,
                        viewBox: "0 0 24 24",
                        width: props.width,
                        height: props.height,
                        role: "img",
                        "aria-hidden": "true"
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
                const DiscordIcon = (props) => React.createElement(
                    "svg",
                    {
                        className: `${config.info.name}--BotTag--Icon--icon ${config.info.name}--BotTag--Icon--Discord`,
                        viewBox: "0 0 28 20",
                        width: props.width,
                        height: props.height,
                        role: "img",
                        "aria-hidden": "true"
                    },
                    React.createElement("path", {
                        d: "M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00546311C8.48074 0.324393 6.67795 0.885118 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z",
                        fill: props.color || "currentColor"
                    })
                );

                const botTagClasses = getModule(Filters.byProps("botTag","botTagCozy"));
                const botTagVariantClasses = getModule(Filters.byProps("botTagRegular"));

                const joinClassNames = (...classNames) => classNames.filter(Boolean).join(" ");

                const VerifiedHook = (props) => React.createElement(
                    "svg",
                    {
                        className: botTagVariantClasses.botTagVerified,
                        width: props.width,
                        height: props.height,
                        viewBox: "0 0 16 15.2",
                        role: "img",
                        "aria-label": "Verified Bot", // TODO: Localize + Tooltip
                        "aria-hidden": "false"
                    },
                    React.createElement("path", { d: "M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z", fill: props.color || "currentColor"})
                );
                const CustomBotTag = ({ type, verified, compact, showIcon, showLabel }) => {
                    try {
                        let icon = BotIcon;
                        switch (type) {
                            case BotTagTypes.BOT:
                                icon = BotIcon;
                                break;
                            case BotTagTypes.WEBHOOK:
                                icon = WebhookIcon;
                                break;
                            case BotTagTypes.OFFICIAL:
                            case BotTagTypes.SYSTEM_DM:
                                verified = true;
                                icon = DiscordIcon;
                        }

                        return React.createElement(
                            "span",
                            {
                                className: joinClassNames(
                                    (compact ? botTagClasses.botTagCompact : botTagClasses.botTagCozy) || botTagClasses.botTag,
                                    botTagVariantClasses.botTagRegular,
                                    botTagVariantClasses.rem,
                                    `${config.info.name}--BotTag--tag`,
                                    `${config.info.name}--BotTag--${BotTagTypes[type]}`
                                )
                            },
                            [
                                verified ? React.createElement(VerifiedHook, { width: 16, height: 16 }) : null,
                                showIcon ? React.createElement(icon, { width: 16, height: 16 }) : null,
                                showLabel ? `${showIcon ? "  " : ""}${BotTagTypes[type]}`: null
                            ]
                            
                        );
                    } catch (err) {
                        Logger.error("Error in CustomBotTag", err);
                    }
                };

                return class extends Plugin {
                    constructor() {
                        super();
                        // remove need for duplication of metadata fields
                        this.getAuthor = null;
                        this.getDescription = null;
                    }

                    patch() {
                        Patcher.before(...MessageHeader, (_, [{message, channel, compact, decorations}]) => {
                            try {
                                if (!message) return;

                                const user = message.author;
                                let type = null;

                                if (message.isSystemDM()) type = BotTagTypes.SYSTEM_DM;
                                else if (this.isDefaultMessage(message)) type = this.isOfficial(message) ? BotTagTypes.OFFICIAL : BotTagTypes.SERVER;
                                else if (this.isWebhook(message)) type = BotTagTypes.WEBHOOK;
                                else if (user?.bot) type = BotTagTypes.BOT;
                                else if (channel.isForumPost() && channel.ownerId === user.id && !isRepliedMessage) type = BotTagTypes.ORIGINAL_POSTER;
                                
                                if (type==null) return;
                                for (let key in decorations) {
                                    if (!decorations[key].props?.className?.includes("botTag")) continue;
                                    decorations[key] = (React.createElement(CustomBotTag, {
                                        compact: compact,
                                        type: type,
                                        verified: user.isVerifiedBot(),
                                        useRemSizes: true,
                                        showIcon: this.settings.icons,
                                        showLabel: this.settings.labels
                                    }));
                                }
                            } catch (err) {
                                Logger.error("Error in MessageHeader patch", err);
                            }
                        });
                    }

                    isDefaultMessage(message) { return message.type===MessageTypes.DEFAULT && message.messageReference!=null }
                    isOfficial(message) { return this.isDefaultMessage(message) && message.messageReference?.guild_id==="667560445975986187" || message.author?.id==="669627189624307712" }
                    isWebhook(message) { return message.webhookId && !message.messageReference && message.author.discriminator == "0000"; }
                    isSystem(message) { return message.author.isSystemUser(); }

                    unpatch() {
                        Patcher.unpatchAll();
                    }

                    onStart() {
                        if (!BotTag) return BdApi.showToast(`${config.info.name}: Failed to resolve BotTag Module`, { type: "error" });
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
