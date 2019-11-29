/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */
/* global browser, singlefile */

singlefile.extension.core.bg.tabs = (() => {
  browser.tabs.onCreated.addListener(tab => onTabCreated(tab));
  browser.tabs.onActivated.addListener(activeInfo => onTabActivated(activeInfo));
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => onTabUpdated(tabId, changeInfo, tab));
  browser.tabs.onRemoved.addListener(tabId => onTabRemoved(tabId));
  return {
    onMessage,
    get: options => browser.tabs.query(options),
    sendMessage: (tabId, message, options) => browser.tabs.sendMessage(tabId, message, options),
    executeScript: (tabId, scriptData) => browser.tabs.executeScript(tabId, scriptData),
  };

  async function onMessage(message) {
    if (message.method.endsWith('.getOptions')) {
      return singlefile.extension.core.bg.config.getOptions(message.url);
    }
  }

  function onTabCreated(tab) {
    singlefile.extension.ui.bg.main.onTabCreated(tab);
  }

  async function onTabActivated(activeInfo) {
    const tab = await browser.tabs.get(activeInfo.tabId);
    singlefile.extension.ui.bg.main.onTabActivated(tab, activeInfo);
  }

  function onTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status == 'loading') {
      singlefile.extension.ui.bg.main.onTabUpdated(tabId, changeInfo, tab);
    }
    if (changeInfo.status == 'complete') {
      singlefile.extension.core.bg.autosave.onTabUpdated(tabId, changeInfo, tab);
    }
  }

  function onTabRemoved(tabId) {
    singlefile.extension.core.bg.tabsData.onTabRemoved(tabId);
  }
})();
