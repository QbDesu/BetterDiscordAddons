/**
* @name ExternalReactDevTools
* @displayName ExternalReactDevTools
* @description Injects the script required by the External React DevTools
* @author Qb
* @authorId 133659541198864384
* @version 1.0.1
* @invite gj7JFa6mF8
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/ExternalReactDevTools
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/ExternalReactDevTools/ExternalReactDevTools.plugin.js
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
            name: "ExternalReactDevTools",
            description: "Injects the script required by the External React DevTools.",
            version: "1.0.1",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/ExternalReactDevTools/ExternalReactDevTools.plugin.js"
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
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                });
            }
        });
    }
    start() { }
    stop() { }
}
: (([Plugin, Api]) => {
    const plugin = (Plugin, {Toasts}) => {

        return class ExternalReactDevTools extends Plugin {
            interval;
            getAuthor = null;
            
            onStart() {
                if ('ReactDevToolsBackend' in window) return console.warn('ReactDevTools was already found!');
                const amdDefine = window.define;
                if (amdDefine) {
                    window.define = undefined;
                }
                const script = document.createElement('script');
                script.setAttribute('id', config.info.name);
                script.setAttribute('src', 'http://localhost:8097');
                script.addEventListener('load', () => {
                    if (amdDefine) {
                        window.define = amdDefine;
                    }
                });
                document.head.appendChild(script);
            }
            
            onStop() {
                Toasts.info(`You need to reload Discord to completely remove ${config.info.name}.`)
            }
        };
    };
    return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
