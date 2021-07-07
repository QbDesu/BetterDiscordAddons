/**
* @name PanelPopout
* @displayName PanelPopout
* @description Lets you view your own popout when clicking on your avatar in the bottom-left panel.
* @author Qb
* @authorId 133659541198864384
* @version 1.1.0
* @invite gj7JFa6mF8
* @source https://github.com/QbDesu/BetterDiscordAddons/blob/potato/Plugins/PanelPopout
* @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/PanelPopout/PanelPopout.plugin.js
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
            name: "PanelPopout",
            version: "1.1.0",
            github_raw: "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/PanelPopout/PanelPopout.plugin.js"
        },
        changelog: [
            { title: "Features", type: "added", items: ["Added Popout Position config option"] },
        ],
        defaultConfig: [
            {
                type: "switch",
                id: "invert",
                name: "Right-click Popout",
                note: "Opens the popout on right-click instead of left-click",
                value: false,
            },
            {
                type: "dropdown",
                id: "position",
                name: "Popout Position",
                note: "The direction where the popout will be placed",
                value: 'top',
                options: [
                    {
                        label: 'Top',
                        value: 'top'
                    },
                    {
                        label: 'Right',
                        value: 'right'
                    }
                ]
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
            DiscordModules: {UserStore},
            DiscordSelectors,
            Popouts,
            Logger,
            Toasts
        } = Api;
        
        const avatarSelector = DiscordSelectors.AccountDetails.avatar || (Logger.warn("Avatar selector missing") || DiscordSelectors.AccountDetails.avatarWrapper);
        const containerSelector = DiscordSelectors.AccountDetails.container || (Logger.warn("Container selector missing") || avatarSelector);
        const popoutSelector = DiscordSelectors.Popouts.popout || (Logger.warn("Popout selector missing") || (DiscordSelectors.Popouts.popouts && `${DiscordSelectors.Popouts.popouts} > *`));
        const statusPickerSelector = '#status-picker';

        return class PanelPopout extends Plugin {
            openingStatusPicker = false;
            detectedPopout = false;
            avatar = null;

            constructor() {
                super();
                this.detectPopout = this.detectPopout.bind(this);
                this.handleLeftClick = this.handleLeftClick.bind(this);
                this.handleRightClick = this.handleRightClick.bind(this);

                // remove need for duplication of metadata fields
                this.getAuthor = null;
                this.getDescription = null;
            }
            
            onStart() {
                if (!avatarSelector || !popoutSelector) {
                    // making really sure it doesn't cause client crashes
                    this.observer = ()=>{};
                    this.initialize = ()=>{};
                    return Toasts.error(`Couldn't start ${config.info.name}: Missing Selector`);
                }
                this.initialize();
            }
            
            onStop() {
                this.cleanup();
            }
            
            observer(mutationRecord) {
                if (mutationRecord.type !== 'childList') return;
                if (!mutationRecord.addedNodes.length) return;
                for (const node of Array.from(mutationRecord.addedNodes)){
                    if (node.matches && node.matches(avatarSelector)) {
                        this.initialize(node);
                        return;
                    } else if (node.querySelector) {
                        const child = node.querySelector(avatarSelector);
                        if (child){
                            this.initialize(child);
                            return;
                        } 
                    }
                }
            }
            
            initialize(avatar) {
                // detect current user here because the store is empty when loading the plugin and shortly after startup
                if(!this.currentUser) this.currentUser = UserStore.getCurrentUser();
                // the avatar element is also not part of the dom first loading and may change when rerendering
                this.cleanup();
                this.avatar = avatar || document.querySelector(avatarSelector);

                if (this.avatar) {
                    this.avatar.addEventListener('mousedown', this.detectPopout);
                    this.avatar.addEventListener('click', this.handleLeftClick);
                    this.avatar.addEventListener('contextmenu', this.handleRightClick);
                }
            }
            
            cleanup() {
                if(this.avatar) {
                    this.avatar.removeEventListener('mousedown', this.detectPopout);
                    this.avatar.removeEventListener('click', this.handleLeftClick);
                    this.avatar.removeEventListener('contextmenu', this.handleRightClick);
                }
            }

            handleLeftClick(e) {
                // bypass event handler when currently trying to open status picker
                if(this.openingStatusPicker) return;

                if (this.settings.invert) {
                    // don't change anything when trying to open the status picker
                    return;
                } else {
                    // prevent opening the status picker
                    e.preventDefault();
                    e.stopPropagation();
                    
                    //open the popout
                    this.openPopout(e);
                }
            }

            handleRightClick(e) {
                // prevent default action just in case
                e.preventDefault();
                e.stopPropagation();

                if (this.settings.invert) {
                    this.openPopout(e);
                } else {
                    this.openStatusPicker(e);
                }
            }
            
            /**
             * Detect if the popout is open on mouse down, so the popout can be closed instead on click.
             * The popout is already closed when the click event fires.
             */
            detectPopout() {
                this.detectedPopout=document.querySelector(popoutSelector); 
            }
            
            /**
             * Shows the user popout unless an open popout was detected.
             * If openingStatusPicker is true bypass this entirely so an the default onclick action (opening the status menu) is performed.
             */
            openPopout() {
                // close the status picker if it's open
                if (document.querySelector(statusPickerSelector)) this.openStatusPicker();

                // don't open popout if one was open already
                if (this.detectedPopout) return;

                try{
                    const container = this.settings.position==='top' ? document.querySelector(containerSelector) : this.avatar;
                    if (container && this.currentUser) {
                        Popouts.showUserPopout(container, this.currentUser, {
                            position: this.settings.position,
                        });
                    }
                } catch (e) {
                    Toasts.error(`Failed to open user popout for ${config.info.name}: ${e}`);
                    Logger.error(e);
                }
            }

            /**
             * Simulates a click on the avatar to open the status menu.
             * openingStatusPicker is set to true to bypass the showUserPopout event handler.
             */
            openStatusPicker() {
                try {
                    this.openingStatusPicker = true;
                    this.avatar.click()
                }
                finally {
                    this.openingStatusPicker = false;
                }
            }
            
            getSettingsPanel() {
                const panel = this.buildSettingsPanel();
                panel.addListener(() => {
                    this.cleanup();
                    this.initialize();
                });
                return panel.getElement();
            }
        };
    };
    return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
