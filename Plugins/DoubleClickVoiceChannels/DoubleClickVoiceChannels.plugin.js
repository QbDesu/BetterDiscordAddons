/**
* @name DoubleClickVoiceChannels
* @description Requires you to double click voice channels to join them.
* @author Qb, Twizzer#0001 & AAGaming#9395
* @authorId 133659541198864384
* @version 1.0.0
* @invite pKx8m6Z
* @license Unlicensed
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/DoubleClickVoiceChannels
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/DoubleClickVoiceChannels/DoubleClickVoiceChannels.plugin.js
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
            name: "DoubleClickVoiceChannels",
            version: "1.0.0",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/DoubleClickVoiceChannels/DoubleClickVoiceChannels.plugin.js"
        }
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
            Patcher,
            WebpackModules,
            Logger
		} = Api;

        const ChannelItem = WebpackModules.getModule(m => m?.default?.displayName == "ChannelItem");
        const ChannelMention = WebpackModules.getModule(m => m?.default?.displayName == "Mention");

        return class GuildNotificationDefaults extends Plugin {
            constructor() {
                super();
                // remove need for duplication of metadata fields
                this.getAuthor = null;
                this.getDescription = null;
            }
            
            async onStart() {
                Patcher.after(ChannelItem, "default", (that, args, value) => {
                    const channel = this.getChannel(value);
                    if (channel) {
                        if (channel.type === 2 || channel.type === 13) {
                            const clickable = this.getClickable(value);
                            if (clickable) {
                                clickable.onDoubleClick = clickable.onClick;
                                delete clickable.onClick;
                            }
                        }
                    } else {
                        Logger.warn('Failed to find channel.');
                    }
        
                    return value;
                });

                Patcher.after(ChannelMention, "default", (that, args, value) => {
                    const label = this.getLabel(value);
                    if (label && label === 'Voice Channel') {
                        const { props } = value;
                        props.onDoubleClick = props.onClick;
                        delete props.onClick;
                    }
        
                    return value;
                });
            }

			onStop() {
                Patcher.unpatchAll();
			}
        
            shouldDescend(key) {
                return key === 'props' || key === 'children' || !isNaN(key);
            }
        
            getChannel(obj) {
                for (const key in obj) {
                    const inner = obj[key];
                    if (inner && typeof inner === 'object') {
                        if (key === 'channel') {
                            return inner;
                        } else if (this.shouldDescend(key)) {
                            return this.getChannel(inner);
                        }
                    }
                }
                return null;
            }
        
            getClickable(obj) {
                for (const key in obj) {
                    const inner = obj[key];
                    if (inner && typeof inner === 'object') {
                        if (inner.onClick && inner.role === 'button') {
                            return inner;
                        } else if (this.shouldDescend(key)) {
                            return this.getClickable(inner);
                        }
                    }
                }
                return null;
            }
        
            getLabel(obj) {
                for (const key in obj) {
                    const inner = obj[key];
                    if (inner) {
                        if (key === 'aria-label') {
                            return inner;
                        } else if (typeof inner === 'object' && this.shouldDescend(key)) {
                            return this.getLabel(inner);
                        }
                    }
                }
                return null;
            }
        };
    };
    return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/