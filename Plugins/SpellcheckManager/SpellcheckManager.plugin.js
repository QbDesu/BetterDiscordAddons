/**
 * @name SpellcheckManager
 * @version 1.0.0
 * @author Qb
 * @description A simple plugin that allows you to remove words from the spellchecker's dictionary.
 * @source https://github.com/QbDesu/BetterDiscordAddons/tree/potato/Plugins/SpellcheckManager
 * @updateUrl https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/SpellcheckManager/SpellcheckManager.plugin.js
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
/* Generated Code */
const config = {
	"main": "./src/index.tsx",
	"scripts": {
		"build": "bdbuilder --plugin SpellcheckManager --build --config ./bdbuilder.config.json",
		"watch": "bdbuilder --plugin SpellcheckManager --watch --config ./bdbuilder.config.json"
	},
	"author": "Qb",
	"license": "Unlicense",
	"devDependencies": {
		"@betterdiscordbuilder/bdbuilder": "^1.2.6-preview.4"
	},
	"info": {
		"name": "SpellcheckManager",
		"version": "1.0.0",
		"authors": [{
			"name": "Qb",
			"discord_id": "133659541198864384",
			"github_username": "QbDesu"
		}],
		"description": "A simple plugin that allows you to remove words from the spellchecker's dictionary.",
		"github": "https://github.com/QbDesu/BetterDiscordAddons/tree/potato/Plugins/SpellcheckManager",
		"github_raw": "https://raw.githubusercontent.com/QbDesu/BetterDiscordAddons/potato/Plugins/SpellcheckManager/SpellcheckManager.plugin.js"
	},
	"build": {
		"zlibrary": true,
		"copy": true,
		"production": false,
		"scssHash": false,
		"alias": {},
		"release": {
			"public": true,
			"source": false,
			"readme": false
		}
	}
};
function buildPlugin([BasePlugin, PluginApi]) {
	const module = {
		exports: {}
	};
	/******/
	(() => { // webpackBootstrap
		/******/
		"use strict";
		class StyleLoader {
			static styles = "";
			static element = null;
			static append(module, css) {
				this.styles += `/* ${module} */\n${css}`;
			}
			static inject(name = config.info.name) {
				if (this.element) this.element.remove();
				this.element = document.head.appendChild(Object.assign(document.createElement("style"), {
					id: name,
					textContent: this.styles
				}));
			}
			static remove() {
				if (this.element) {
					this.element.remove();
					this.element = null;
				}
			}
		}
		function ___createMemoize___(instance, name, value) {
			value = value();
			Object.defineProperty(instance, name, {
				value,
				configurable: true
			});
			return value;
		};
		const Modules = {
			get 'react-spring'() {
				return ___createMemoize___(this, 'react-spring', () => BdApi.findModuleByProps('useSpring'))
			},
			'@discord/utils': {
				get 'joinClassNames'() {
					return ___createMemoize___(this, 'joinClassNames', () => BdApi.findModule(m => typeof m?.default?.default === 'function')?.default)
				},
				get 'useForceUpdate'() {
					return ___createMemoize___(this, 'useForceUpdate', () => BdApi.findModuleByProps('useForceUpdate')?.useForceUpdate)
				},
				get 'Logger'() {
					return ___createMemoize___(this, 'Logger', () => BdApi.findModuleByProps('setLogFn')?.default)
				},
				get 'Navigation'() {
					return ___createMemoize___(this, 'Navigation', () => BdApi.findModuleByProps('replaceWith'))
				}
			},
			'@discord/components': {
				get 'Tooltip'() {
					return ___createMemoize___(this, 'Tooltip', () => BdApi.findModuleByDisplayName('Tooltip'))
				},
				get 'TooltipContainer'() {
					return ___createMemoize___(this, 'TooltipContainer', () => BdApi.findModuleByProps('TooltipContainer')?.TooltipContainer)
				},
				get 'TextInput'() {
					return ___createMemoize___(this, 'TextInput', () => BdApi.findModuleByDisplayName('TextInput'))
				},
				get 'SlideIn'() {
					return ___createMemoize___(this, 'SlideIn', () => BdApi.findModuleByDisplayName('SlideIn'))
				},
				get 'SettingsNotice'() {
					return ___createMemoize___(this, 'SettingsNotice', () => BdApi.findModuleByDisplayName('SettingsNotice'))
				},
				get 'TransitionGroup'() {
					return ___createMemoize___(this, 'TransitionGroup', () => BdApi.findModuleByDisplayName('TransitionGroup'))
				},
				get 'Button'() {
					return ___createMemoize___(this, 'Button', () => BdApi.findModuleByProps('DropdownSizes'))
				},
				get 'Flex'() {
					return ___createMemoize___(this, 'Flex', () => BdApi.findModuleByDisplayName('Flex'))
				},
				get 'Text'() {
					return ___createMemoize___(this, 'Text', () => BdApi.findModuleByDisplayName('Text'))
				},
				get 'Card'() {
					return ___createMemoize___(this, 'Card', () => BdApi.findModuleByDisplayName('Card'))
				}
			},
			'@discord/modules': {
				get 'Dispatcher'() {
					return ___createMemoize___(this, 'Dispatcher', () => BdApi.findModuleByProps('dirtyDispatch', 'subscribe'))
				},
				get 'EmojiUtils'() {
					return ___createMemoize___(this, 'EmojiUtils', () => BdApi.findModuleByProps('uploadEmoji'))
				},
				get 'PermissionUtils'() {
					return ___createMemoize___(this, 'PermissionUtils', () => BdApi.findModuleByProps('computePermissions'))
				},
				get 'DMUtils'() {
					return ___createMemoize___(this, 'DMUtils', () => BdApi.findModuleByProps('openPrivateChannel'))
				}
			},
			'@discord/stores': {
				get 'Messages'() {
					return ___createMemoize___(this, 'Messages', () => BdApi.findModuleByProps('getMessage', 'getMessages'))
				},
				get 'Channels'() {
					return ___createMemoize___(this, 'Channels', () => BdApi.findModuleByProps('getChannel'))
				},
				get 'Guilds'() {
					return ___createMemoize___(this, 'Guilds', () => BdApi.findModuleByProps('getGuild'))
				},
				get 'SelectedGuilds'() {
					return ___createMemoize___(this, 'SelectedGuilds', () => BdApi.findModuleByProps('getGuildId', 'getLastSelectedGuildId'))
				},
				get 'SelectedChannels'() {
					return ___createMemoize___(this, 'SelectedChannels', () => BdApi.findModuleByProps('getChannelId', 'getLastSelectedChannelId'))
				},
				get 'Info'() {
					return ___createMemoize___(this, 'Info', () => BdApi.findModuleByProps('getSessionId'))
				},
				get 'Status'() {
					return ___createMemoize___(this, 'Status', () => BdApi.findModuleByProps('getStatus'))
				},
				get 'Users'() {
					return ___createMemoize___(this, 'Users', () => BdApi.findModuleByProps('getUser', 'getCurrentUser'))
				},
				get 'SettingsStore'() {
					return ___createMemoize___(this, 'SettingsStore', () => BdApi.findModuleByProps('afkTimeout', 'status'))
				},
				get 'UserProfile'() {
					return ___createMemoize___(this, 'UserProfile', () => BdApi.findModuleByProps('getUserProfile'))
				},
				get 'Members'() {
					return ___createMemoize___(this, 'Members', () => BdApi.findModuleByProps('getMember'))
				},
				get 'Activities'() {
					return ___createMemoize___(this, 'Activities', () => BdApi.findModuleByProps('getActivities'))
				},
				get 'Games'() {
					return ___createMemoize___(this, 'Games', () => BdApi.findModuleByProps('getGame'))
				},
				get 'Auth'() {
					return ___createMemoize___(this, 'Auth', () => BdApi.findModuleByProps('getId', 'isGuest'))
				},
				get 'TypingUsers'() {
					return ___createMemoize___(this, 'TypingUsers', () => BdApi.findModuleByProps('isTyping'))
				}
			},
			'@discord/actions': {
				get 'ProfileActions'() {
					return ___createMemoize___(this, 'ProfileActions', () => BdApi.findModuleByProps('fetchProfile'))
				},
				get 'GuildActions'() {
					return ___createMemoize___(this, 'GuildActions', () => BdApi.findModuleByProps('requestMembersById'))
				}
			},
			get '@discord/i18n'() {
				return ___createMemoize___(this, '@discord/i18n', () => BdApi.findModuleByProps('getLocale'))
			},
			get '@discord/constants'() {
				return ___createMemoize___(this, '@discord/constants', () => BdApi.findModuleByProps('API_HOST'))
			},
			get '@discord/contextmenu'() {
				return ___createMemoize___(this, '@discord/contextmenu', () => {
					const ctx = Object.assign({}, BdApi.findModuleByProps('openContextMenu'), BdApi.findModuleByProps('MenuItem'));
					ctx.Menu = ctx.default;
					return ctx;
				})
			},
			get '@discord/forms'() {
				return ___createMemoize___(this, '@discord/forms', () => BdApi.findModuleByProps('FormItem'))
			},
			get '@discord/scrollbars'() {
				return ___createMemoize___(this, '@discord/scrollbars', () => BdApi.findModuleByProps('ScrollerAuto'))
			},
			get '@discord/native'() {
				return ___createMemoize___(this, '@discord/native', () => BdApi.findModuleByProps('requireModule'))
			},
			get '@discord/flux'() {
				return ___createMemoize___(this, '@discord/flux', () => Object.assign({}, BdApi.findModuleByProps('useStateFromStores').default, BdApi.findModuleByProps('useStateFromStores')))
			},
			get '@discord/modal'() {
				return ___createMemoize___(this, '@discord/modal', () => Object.assign({}, BdApi.findModuleByProps('ModalRoot'), BdApi.findModuleByProps('openModal')))
			},
			get '@discord/connections'() {
				return ___createMemoize___(this, '@discord/connections', () => BdApi.findModuleByProps('get', 'isSupported', 'map'))
			},
			get '@discord/sanitize'() {
				return ___createMemoize___(this, '@discord/sanitize', () => BdApi.findModuleByProps('stringify', 'parse', 'encode'))
			},
			get '@discord/icons'() {
				return ___createMemoize___(this, '@discord/icons', () => BdApi.findAllModules(m => m.displayName && ~m.toString().indexOf('currentColor')).reduce((icons, icon) => (icons[icon.displayName] = icon, icons), {}))
			},
			'@discord/classes': {
				get 'Timestamp'() {
					return ___createMemoize___(this, 'Timestamp', () => BdApi.findModuleByPrototypes('toDate', 'month'))
				},
				get 'Message'() {
					return ___createMemoize___(this, 'Message', () => BdApi.findModuleByPrototypes('getReaction', 'isSystemDM'))
				},
				get 'User'() {
					return ___createMemoize___(this, 'User', () => BdApi.findModuleByPrototypes('tag'))
				},
				get 'Channel'() {
					return ___createMemoize___(this, 'Channel', () => BdApi.findModuleByPrototypes('isOwner', 'isCategory'))
				}
			}
		};
		/******/
		var __webpack_modules__ = ({
			/***/
			832:
				/***/
				((module) => {
					module.exports = BdApi.React;
					/***/
				})
			/******/
		});
		/************************************************************************/
		/******/ // The module cache
		/******/
		var __webpack_module_cache__ = {};
		/******/
		/******/ // The require function
		/******/
		function __webpack_require__(moduleId) {
			/******/ // Check if module is in cache
			/******/
			var cachedModule = __webpack_module_cache__[moduleId];
			/******/
			if (cachedModule !== undefined) {
				/******/
				return cachedModule.exports;
				/******/
			}
			/******/ // Create a new module (and put it into the cache)
			/******/
			var module = __webpack_module_cache__[moduleId] = {
				/******/ // no module.id needed
				/******/ // no module.loaded needed
				/******/
				exports: {}
				/******/
			};
			/******/
			/******/ // Execute the module function
			/******/
			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
			/******/
			/******/ // Return the exports of the module
			/******/
			return module.exports;
			/******/
		}
		/******/
		/************************************************************************/
		/******/
		/* webpack/runtime/compat get default export */
		/******/
		(() => {
			/******/ // getDefaultExport function for compatibility with non-harmony modules
			/******/
			__webpack_require__.n = (module) => {
				/******/
				var getter = module && module.__esModule ?
					/******/
					() => (module['default']) :
					/******/
					() => (module);
				/******/
				__webpack_require__.d(getter, {
					a: getter
				});
				/******/
				return getter;
				/******/
			};
			/******/
		})();
		/******/
		/******/
		/* webpack/runtime/define property getters */
		/******/
		(() => {
			/******/ // define getter functions for harmony exports
			/******/
			__webpack_require__.d = (exports, definition) => {
				/******/
				for (var key in definition) {
					/******/
					if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
						/******/
						Object.defineProperty(exports, key, {
							enumerable: true,
							get: definition[key]
						});
						/******/
					}
					/******/
				}
				/******/
			};
			/******/
		})();
		/******/
		/******/
		/* webpack/runtime/hasOwnProperty shorthand */
		/******/
		(() => {
			/******/
			__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
			/******/
		})();
		/******/
		/******/
		/* webpack/runtime/make namespace object */
		/******/
		(() => {
			/******/ // define __esModule on exports
			/******/
			__webpack_require__.r = (exports) => {
				/******/
				if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
					/******/
					Object.defineProperty(exports, Symbol.toStringTag, {
						value: 'Module'
					});
					/******/
				}
				/******/
				Object.defineProperty(exports, '__esModule', {
					value: true
				});
				/******/
			};
			/******/
		})();
		/******/
		/************************************************************************/
		var __webpack_exports__ = {};
		// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
		(() => {
			// ESM COMPAT FLAG
			__webpack_require__.r(__webpack_exports__);
			// EXPORTS
			__webpack_require__.d(__webpack_exports__, {
				"default": () => ( /* binding */ DisableAllButton)
			});
			; // CONCATENATED MODULE: external "BasePlugin"
			const external_BasePlugin_namespaceObject = BasePlugin;
			var external_BasePlugin_default = /*#__PURE__*/ __webpack_require__.n(external_BasePlugin_namespaceObject);
			// EXTERNAL MODULE: external "BdApi.React"
			var external_BdApi_React_ = __webpack_require__(832);
			var external_BdApi_React_default = /*#__PURE__*/ __webpack_require__.n(external_BdApi_React_);; // CONCATENATED MODULE: external "PluginApi"
			const external_PluginApi_namespaceObject = PluginApi;; // CONCATENATED MODULE: external ["Modules","@discord/forms"]
			const forms_namespaceObject = Modules["@discord/forms"];; // CONCATENATED MODULE: external ["Modules","@discord/components"]
			const components_namespaceObject = Modules["@discord/components"];; // CONCATENATED MODULE: ./src/Settings.tsx
			function _extends() {
				_extends = Object.assign || function(target) {
					for (var i = 1; i < arguments.length; i++) {
						var source = arguments[i];
						for (var key in source) {
							if (Object.prototype.hasOwnProperty.call(source, key)) {
								target[key] = source[key];
							}
						}
					}
					return target;
				};
				return _extends.apply(this, arguments);
			}
			const localStorage = external_PluginApi_namespaceObject.WebpackModules.getByProps("ObjectStorage").impl;
			const SpellcheckStore = external_PluginApi_namespaceObject.WebpackModules.getByProps('setLearnedWords');
			const Titles = external_PluginApi_namespaceObject.WebpackModules.getByProps("titleDefault");
			function DeleteButton(props) {
				return /*#__PURE__*/ external_BdApi_React_default().createElement("button", _extends({
					class: "bd-button bd-button-danger"
				}, props), /*#__PURE__*/ external_BdApi_React_default().createElement("svg", {
					fill: "#FFFFFF",
					viewBox: "0 0 24 24",
					width: "20px",
					height: "20px"
				}, /*#__PURE__*/ external_BdApi_React_default().createElement("path", {
					fill: "none",
					d: "M0 0h24v24H0V0z"
				}), /*#__PURE__*/ external_BdApi_React_default().createElement("path", {
					d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
				}), /*#__PURE__*/ external_BdApi_React_default().createElement("path", {
					fill: "none",
					d: "M0 0h24v24H0z"
				})));
			}
			function Settings() {
				const [spellcheckStoreState, setSpellcheckStoreState] = (0, external_BdApi_React_.useState)(localStorage.get('SpellcheckStore') || {
					enabled: true,
					learnedWords: []
				});
				const learnedWords = spellcheckStoreState.learnedWords;
				function removeWord(word) {
					setSpellcheckStoreState(state => {
						const newState = {
							enabled: state.enabled,
							learnedWords: learnedWords.filter(w => w != word)
						};
						localStorage.set('SpellcheckStore', newState);
						SpellcheckStore.setLearnedWords(new Set(newState.learnedWords));
						return newState;
					});
				}
				return /*#__PURE__*/ external_BdApi_React_default().createElement((external_BdApi_React_default()).Fragment, null, /*#__PURE__*/ external_BdApi_React_default().createElement(forms_namespaceObject.FormItem, {
					title: "Learned Words"
				}, learnedWords.length ? learnedWords.map(word => /*#__PURE__*/ external_BdApi_React_default().createElement(components_namespaceObject.Flex, {
					align: components_namespaceObject.Flex.Align.START
				}, /*#__PURE__*/ external_BdApi_React_default().createElement(components_namespaceObject.Flex.Child, {
					wrap: false
				}, /*#__PURE__*/ external_BdApi_React_default().createElement("div", {
					className: Titles?.title
				}, word)), /*#__PURE__*/ external_BdApi_React_default().createElement(components_namespaceObject.Flex, {
					grow: 0,
					shrink: 0
				}, /*#__PURE__*/ external_BdApi_React_default().createElement(DeleteButton, {
					onClick: () => {
						removeWord(word);
					}
				})))) : /*#__PURE__*/ external_BdApi_React_default().createElement("div", {
					className: Titles?.title
				}, "No entries")));
			}; // CONCATENATED MODULE: ./src/index.tsx
			/* provided dependency */
			var React = __webpack_require__(832);
			class DisableAllButton extends(external_BasePlugin_default()) {
				onStart() {}
				onStop() {}
				getSettingsPanel() {
					return /*#__PURE__*/ React.createElement(Settings, null);
				}
			}
		})();
		module.exports.LibraryPluginHack = __webpack_exports__;
		/******/
	})();
	const PluginExports = module.exports.LibraryPluginHack;
	return PluginExports?.__esModule ? PluginExports.default : PluginExports;
}
module.exports = window.hasOwnProperty("ZeresPluginLibrary") ?
	buildPlugin(window.ZeresPluginLibrary.buildPlugin(config)) :
	class {
		getName() {
			return config.info.name;
		}
		getAuthor() {
			return config.info.authors.map(a => a.name).join(", ");
		}
		getDescription() {
			return `${config.info.description}. __**ZeresPluginLibrary was not found! This plugin will not work!**__`;
		}
		getVersion() {
			return config.info.version;
		}
		load() {
			BdApi.showConfirmationModal(
				"Library plugin is needed",
				[`The library plugin needed for ${config.info.name} is missing. Please click Download to install it.`], {
					confirmText: "Download",
					cancelText: "Cancel",
					onConfirm: () => {
						require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
							if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
							await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
						});
					}
				}
			);
		}
		start() {}
		stop() {}
	};
/*@end@*/