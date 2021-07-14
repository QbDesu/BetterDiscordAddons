import BasePlugin from "@zlibrary/plugin";
import Settings from "./Settings";

export default class DisableAllButton extends BasePlugin {
    onStart(): void {}

    onStop(): void {}

    getSettingsPanel() {
        return (<Settings />);
    }
}