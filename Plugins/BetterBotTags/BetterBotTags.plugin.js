/**
* @name BetterBotTags
* @description Some improvements for bot tags, like the addition of webhook tags.
* @author Qb, Ben855
* @authorId 133659541198864384
* @version 1.0.0
* @invite gj7JFa6mF8
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/BetterBotTags
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/BetterBotTags/BetterBotTags.plugin.js
* @license MIT
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
            name: "BetterBotTags",
            version: "1.0.1",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/BetterBotTags/BetterBotTags.plugin.js"
        },
        changelog: [
            { title: 'Bug Fixes', types: 'fixed', items: ['Fixed bot tag type not displaying the proper text under some circumstances.'] }
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

                const MessageTimestamp = WebpackModules.find(m => typeof m.default === "function" && m.default.toString().includes("showTimestampOnHover"));
                const BotTag = WebpackModules.find(m => m.default.displayName === "BotTag");
                const BotTagTypes = { ...(BotTag.default.Types || BotTag.BotTagTypes), WEBHOOK: 13, CLYDE: 12, 13: "WEBHOOK", 12: "CLYDE" };
                const botTagClasses = WebpackModules.getByProps("botTagCozy");
                const DiscordTag = WebpackModules.find(m => m.default.displayName === "DiscordTag");
                const WebhookIcon = WebpackModules.getByDisplayName("Webhook");
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
                        Patcher.after(MessageTimestamp, "default", (_, [{ message }], res) => {
                            if (!message) return;

                            if (this.isClyde(message.author)) {
                                const header = Utilities.findInReactTree(res, e => Array.isArray(e?.props?.children) && e.props.children.find(c => c?.props?.message));
                                header.props.children.push(React.createElement(BotTag.default, {
                                    type: BotTagTypes.CLYDE,
                                    verified: false,
                                    useRemSizes: true,
                                    className: `${botTagClasses.botTagCozy} ${botTagClasses.botTagCompact}`
                                }));
                            } else if (message.webhookId && !message.messageReference && message.author.discriminator == "0000") {
                                const header = Utilities.findInReactTree(res, e => Array.isArray(e?.props?.children) && e.props.children.find(c => c?.props?.message));
                                header.props.children[0].props.message.author.bot = false;
                                header.props.children.push(React.createElement(BotTag.default, {
                                    type: BotTagTypes.WEBHOOK,
                                    verified: false,
                                    useRemSizes: true,
                                    className: `${botTagClasses.botTagCozy} ${botTagClasses.botTagCompact}`
                                }));
                            }
                        });

                        Patcher.after(WebpackModules.find(m => m.default.displayName === "BotTag"), "default", (_, [{ type }], res) => {
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

                    isClyde(user) {
                        return user.id === "1" && user.username === "Clyde";
                    }

                    unpatch() {
                        Patcher.unpatchAll();
                    }

                    onStart() {
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
