import {useState} from 'react';

export default function ToggleAddonsButton(addonType){
    const [cachedAddons, setCachedAddons] = useState([]);

    function onClick(){
        if (cachedAddons.length) {
            // if there are cached addons turn them back on
            cachedAddons.forEach(p => BdApi.Plugins.enable(p.id));
            setCachedAddons([]);
        } else {
            // otherwise turn all addons off
            // excluding disable all button itself
            const enabledAddons = BdApi.Plugins.getAll().filter(p => BdApi.Plugins.isEnabled(p.id) && p.name !== config.info.name);
            enabledAddons.forEach(p => BdApi.Plugins.disable(p.id));
            setCachedAddons(enabledAddons);
        }
    }

    return (<button
        className={`bd-button bd-button-title disable-all--button disable-all--button-${cachedAddons.length?'enable':'disable'}`}
        onClick={onClick} >
            {cachedAddons.length?'Reenable All':'Disable All'}
    </button>);
}