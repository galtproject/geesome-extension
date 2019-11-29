/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global browser, singlefile, setTimeout */

singlefile.extension.core.bg.tabsData = (() => {
  let persistentData, temporaryData, cleanedUp;
  setTimeout(() => getPersistent().then(tabsData => (persistentData = tabsData)), 0);
  return {
    onMessage,
    onTabRemoved,
    getTemporary,
    get: getPersistent,
    set: setPersistent,
  };

  async function onMessage(message) {
    if (message.method.endsWith('.get')) {
      return getPersistent();
    }
    if (message.method.endsWith('.set')) {
      return setPersistent(message.tabsData);
    }
  }

  async function onTabRemoved(tabId) {
    if (temporaryData) {
      delete temporaryData[tabId];
    }
    const tabsData = await getPersistent();
    delete tabsData[tabId];
    setPersistent(tabsData);
  }

  function getTemporary(desiredTabId) {
    if (!temporaryData) {
      temporaryData = {};
    }
    if (desiredTabId !== undefined && !temporaryData[desiredTabId]) {
      temporaryData[desiredTabId] = {};
    }
    return temporaryData;
  }

  async function getPersistent(desiredTabId) {
    if (!persistentData) {
      const config = await browser.storage.local.get();
      persistentData = config.tabsData || {};
    }
    cleanup();
    if (desiredTabId !== undefined && !persistentData[desiredTabId]) {
      persistentData[desiredTabId] = {};
    }
    return persistentData;
  }

  async function setPersistent(tabsData) {
    persistentData = tabsData;
    await browser.storage.local.set({ tabsData });
  }

  async function cleanup() {
    if (!cleanedUp && singlefile.extension.core.bg.tabs) {
      cleanedUp = true;
      const allTabs = await singlefile.extension.core.bg.tabs.get({ currentWindow: true, highlighted: true });
      Object.keys(persistentData)
        .filter(key => {
          if (key != 'autoSaveAll' && key != 'autoSaveUnpinned' && key != 'profileName') {
            return !allTabs.find(tab => tab.id == key);
          }
        })
        .forEach(tabId => delete persistentData[tabId]);
      await browser.storage.local.set({ tabsData: persistentData });
    }
  }
})();
