/**
* @name GuildNotificationDefaults
* @description Automatically set the notification settings of servers you join.
* @author Qb
* @authorId 133659541198864384
* @version 1.0.0
* @invite gj7JFa6mF8
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/GuildNotificationDefaults
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/GuildNotificationDefaults/GuildNotificationDefaults.plugin.js
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
            name: "GuildNotificationDefaults",
            version: "1.0.0",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/GuildNotificationDefaults/GuildNotificationDefaults.plugin.js"
        },
        defaultConfig: [
            {
                type: "switch",
                id: "muted",
                name: "Muted",
                note: "Automatically mute all new servers",
                value: false
            },
			{
				type: "dropdown",
				id: "message_notifications",
				name: "Message Notifications",
                value: 1,
                options: [
                    {
                        label: 'All Messages',
                        value: 0
                    },
                    {
                        label: 'Only @mentions',
                        value: 1
                    },
                    {
                        label: 'Nothing',
                        value: 2
                    }
                ]
			},
            {
                type: "switch",
                id: "suppress_everyone",
                name: "Supress @everyone and @here",
                note: "Automatically supress @everyone and @here mentions",
                value: true
            },
            {
                type: "switch",
                id: "supress_roles",
                name: "Supress All Role @mentions",
                note: "Automatically supress all role @mentions",
                value: false
            },
            {
                type: "switch",
                id: "mobile_push",
                name: "Mobile Push Notifications",
                note: "Enable mobile push notifications for new servers",
                value: false
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
			WebpackModules,
			DiscordModules: {
				Dispatcher,
				DiscordConstants: {ActionTypes: INVITE_ACCEPT_SUCCESS}
			}
		} = Api;

		const GuildNotifications = WebpackModules.getByProps("updateGuildNotificationSettings");

        return class GuildNotificationDefaults extends Plugin {
            constructor() {
                super();
                // remove need for duplication of metadata fields
                this.getAuthor = null;
                this.getDescription = null;
				this.onInviteAccept = this.onInviteAccept.bind(this);
            }
            
            onStart() {
                Dispatcher.subscribe(INVITE_ACCEPT_SUCCESS, this.onInviteAccept);
            }

			onInviteAccept({invite: {guild: {id}}}) {
				GuildNotifications.updateGuildNotificationSettings(id, {
					muted: this.settings.muted,
					supress_roles: this.settings.supress_roles,
					supress_everyone: this.settings.supress_everyone,
					mobile_push: this.settings.mobile_push
				});
			}

			onStop() {
				Dispatcher.unsubscribe(INVITE_ACCEPT_SUCCESS, this.onInviteAccept);
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
