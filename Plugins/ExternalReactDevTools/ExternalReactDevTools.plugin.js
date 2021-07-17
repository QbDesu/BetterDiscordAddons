/**
* @name ExternalReactDevTools
* @displayName ExternalReactDevTools
* @description Injects the script required by the External React DevTools
* @author Qb
* @authorId 133659541198864384
* @version 1.0.2
* @invite gj7JFa6mF8
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/ExternalReactDevTools
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/ExternalReactDevTools/ExternalReactDevTools.plugin.js
*/

module.exports = class {
    constructor() {}
    load() {
        BdApi.alert("External React DevTools incompatible", `Due to a recent Discord update the External React DevTools no longer seem to be compatible with Discord. You can uninstall the extension now.`);
    }
    start() { }
    stop() { }
}