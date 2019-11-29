/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global singlefile */

singlefile.extension.ui.bg.main = (() => {
  return {
    onMessage(message, sender) {
      if (message.method.endsWith('.refreshMenu')) {
        return singlefile.extension.ui.bg.menus.onMessage(message, sender);
      } else {
        return singlefile.extension.ui.bg.button.onMessage(message, sender);
      }
    },
    async refreshTab(tab) {
      return Promise.all([singlefile.extension.ui.bg.menus.refreshTab(tab), singlefile.extension.ui.bg.button.refreshTab(tab)]);
    },
    onForbiddenDomain(tab) {
      singlefile.extension.ui.bg.button.onForbiddenDomain(tab);
    },
    onStart(tabId, step, autoSave) {
      singlefile.extension.ui.bg.button.onStart(tabId, step, autoSave);
    },
    onError(tabId) {
      singlefile.extension.ui.bg.button.onError(tabId);
    },
    onEnd(tabId, autoSave) {
      singlefile.extension.ui.bg.button.onEnd(tabId, autoSave);
    },
    onTabCreated(tab) {
      singlefile.extension.ui.bg.menus.onTabCreated(tab);
    },
    onTabActivated(tab, activeInfo) {
      singlefile.extension.ui.bg.menus.onTabActivated(tab, activeInfo);
    },
    onTabUpdated(tabId, changeInfo, tab) {
      singlefile.extension.ui.bg.menus.onTabUpdated(tabId, changeInfo, tab);
    },
  };
})();
