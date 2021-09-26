/**
* @name PanelPopout
* @displayName PanelPopout
* @description Lets you view your own popout when clicking on your avatar in the bottom-left panel.
* @author Qb
* @authorId 133659541198864384
* @version 1.2.0
* @invite gj7JFa6mF8
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/PanelPopout
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/PanelPopout/PanelPopout.plugin.js
*/
// "1.2.0"
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

module.exports = class {
    constructor() {}
    load() {
        BdApi.showConfirmationModal("PanelPopout was discontinued", 
            [`PanelPopout was discontinued because of recent Discord updates. The changes to discord make it near impossible to fix it to work like before`,
                `However UserDetails by Strencher recently added a similar feature. Click here to download UserDetails if it isn't installed already and automatically remove this plugin.`],
            {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    if(!BdApi.Plugins.get("UserDetails")){
                        require("request").get("https://betterdiscord.app/Download?id=293", async (error, response, body) => {
                            if (error) {
                                require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                                require("fs").unlinkSync(require("path").join(BdApi.Plugins.folder, "PanelPopout.plugin.js"));
                                return;
                            }
                            await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "UserDetails.plugin.js"), body, r));
                            require("fs").unlinkSync(require("path").join(BdApi.Plugins.folder, "PanelPopout.plugin.js"));
                        });
                    } else {
                        require("fs").unlinkSync(require("path").join(BdApi.Plugins.folder, "PanelPopout.plugin.js"));
                    }
                }
            }
        );
    }
    start() { }
    stop() { }
};

/*@end@*/
