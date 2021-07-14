import {Patcher, WebpackModules, Logger} from "@zlibrary";
import BasePlugin from "@zlibrary/plugin";

export default class DisableAllButton extends BasePlugin {
    onStart(): void {
        this.patchSettingsView()
    }

    async patchSettingsView(): Promise<void> {
        const SettingsView = WebpackModules.find(m=>m?.default?.displayName=='SettingsView').default.prototype;
        
        Patcher.after(SettingsView, "render", (_, args, returnValue) => {
            Logger.log(args);
            Logger.log(returnValue);
            return;
        });
    }

    onStop(): void {
        Patcher.unpatchAll();
    }
}