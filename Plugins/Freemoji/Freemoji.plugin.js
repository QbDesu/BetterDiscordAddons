/**
* @name Freemoji
* @displayName Freemoji
* @authorId 133659541198864384
* @invite gj7JFa6mF8
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/Freemoji/Freemoji.plugin.js
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
            name: "Freemoji",
            authors: [
                {
                    name: "Qb",
                    discord_id: "133659541198864384",
                    github_username: "QbDesu"
                },
                {
                    name: "lemons",
                    discord_id: "407348579376693260",
                    github_username: "respecting"
                }
            ],
            version: "1.1.0",
            description: "Send emoji without Nitro.",
            github: "https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/Freemoji",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/Freemoji/Freemoji.plugin.js"
        }
    };

    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        getName() { return config.info.name; }
        getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
        getDescription() { return config.info.description; }
        getVersion() { return config.info.version; }
        load() {
            BdApi.showConfirmationModal("Library plugin is needed",
                [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() { }
        stop() { }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const {
                Patcher,
                DiscordModules,
                DiscordAPI,
                Settings,
                PluginUtilities
            } = Api;
            return class Freemoji extends Plugin {
                defaultSettings = {
                    "emojiSize": "40",
                    "emojiRemoveGrayscale": true,
                };
                settings = PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
                originalNitroStatus = 0;
                css = `
                .emojiItemDisabled-1FvFuF {
                    filter: grayscale(0%);
                }
                `;

                getSettingsPanel() {
                    return Settings.SettingPanel.build(_ => this.saveAndUpdate(), ...[
                        new Settings.SettingGroup("Emojis").append(
                            new Settings.Slider("Size", "The size of the emoji in pixels. 40 is recommended.", 16, 64, this.settings.emojiSize, size=>this.settings.emojiSize = size, {markers:[16,20,32,40,64], stickToMarkers:true}),
                            new Settings.Switch("Remove Grayscale Filter", "Remove the grayscale filter on emoji that would normally not be usable.", this.settings.emojiRemoveGrayscale, value => this.settings.emojiRemoveGrayscale = value),
                        )
                    ])
                }
                
                saveAndUpdate() {
                    PluginUtilities.saveSettings(this.getName(), this.settings)

                    //fix emotes with bad method
                    Patcher.before(DiscordModules.MessageActions, "sendMessage", (_, [, msg]) => {
                        msg.validNonShortcutEmojis.forEach(emoji => {
                            if (emoji.url.startsWith("/assets/")) return;
                            msg.content = msg.content.replace(`<${emoji.animated ? "a" : ""}${emoji.allNamesString.replace(/~\d/g, "")}${emoji.id}>`, emoji.url + `&size=${this.settings.emojiSize} `)
                        })
                    });
                    //for editing message also
                    Patcher.before(DiscordModules.MessageActions, "editMessage", (_,obj) => {
                        let msg = obj[2].content;
                        if (msg.search(/\d{18}/g) == -1) return;
                        msg.match(/<a:.+?:\d{18}>|<:.+?:\d{18}>/g).forEach(idfkAnymore=>{
                            obj[2].content = obj[2].content.replace(idfkAnymore, `https://cdn.discordapp.com/emojis/${idfkAnymore.match(/\d{18}/g)[0]}?size=${this.settings.emojiSize}`);
                        });
                    });

                    if (this.settings.emojiRemoveGrayscale && !document.getElementById(`${config.info.name}--grayscale`)){
                        PluginUtilities.addStyle(`${config.info.name}--grayscale`, this.css);
                    } else {
                        PluginUtilities.removeStyle(`${config.info.name}--grayscale`);
                    }
                }

                onStart() {
                    this.originalNitroStatus = DiscordAPI.currentUser.discordObject.premiumType;
                    this.saveAndUpdate();
                    DiscordAPI.currentUser.discordObject.premiumType = 2;
                }

                onStop() {
                    DiscordAPI.currentUser.discordObject.premiumType = this.originalNitroStatus;
                    Patcher.unpatchAll();
                    PluginUtilities.removeStyle(`${config.info.name}--grayscale`);
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/