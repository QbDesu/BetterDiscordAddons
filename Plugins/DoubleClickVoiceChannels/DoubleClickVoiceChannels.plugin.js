/**
* @name DoubleClickVoiceChannels
* @description Requires you to double click voice channels to join them.
* @author Qb
* @authorId 133659541198864384
* @version 1.2.0
* @invite pKx8m6Z
* @license Unlicensed
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/DoubleClickVoiceChannels
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/DoubleClickVoiceChannels/DoubleClickVoiceChannels.plugin.js
*/
/*@cc_on
@if (@_jscript)

var shell = WScript.CreateObject("WScript.Shell");
shell.Popup("It looks like you've mistakenly tried to run me directly. That's not how you install plugins. \n(So don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);

@else@*/
module.exports = (() => {
    const config = {
        info: {
            name: "DoubleClickVoiceChannels",
            version: "1.2.0",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/DoubleClickVoiceChannels/DoubleClickVoiceChannels.plugin.js"
        },
        changelog: [
            {
                title: 'Changes',
                type: 'changed',
                items: ['Dropped support for voice channel mentions. Just the channel list is affected now.'],
            },
            {
                title: 'Fixes',
                type: 'fixed',
                items: ['Fixed the plugin again, after a long time waiting, sorry.'],
            },
        ],
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
                    Webpack: { getByKeys },
                    Utils: { findInTree },
                    UI: { showToast }
                } = new BdApi(config.info.name);

                const ChannelItem = [getByKeys('ChannelItemIcon'), "default"];

                return class DoubleClickVoiceChannels extends Plugin {
                    constructor() {
                        super();
                        // remove need for duplication of metadata fields
                        this.getAuthor = null;
                        this.getDescription = null;
                    }

                    async onStart() {
                        if (ChannelItem?.[0]){
                            Patcher.after(...ChannelItem, (_this, [props], value) => {
                                const { channel } = props;
                                if (channel?.type === 2 || channel?.type === 13) {
                                    const clickable = findInTree(value, (item) => item?.onClick && item.role === "button", { walkable: ["props", "children", "child", "sibling"] });
                                    if (clickable) {
                                        clickable.onDoubleClick = clickable.onClick;
                                        delete clickable.onClick;
                                    } else {
                                        Logger.warn("Could not find clickable element for channel", channel);
                                    }
                                }

                                return value;
                            });
                        } else {
                            showToast(`[${config.info.name}] Could not find ChannelItem. Plugin will not work correctly.`);
                        }
                    }

                    onStop() {
                        Patcher.unpatchAll();
                    }
                };
            };
            return plugin(Plugin, Api);
        })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/