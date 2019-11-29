/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global browser, singlefile, */

singlefile.extension.core.bg.messages = (() => {
  browser.runtime.onMessage.addListener((message, sender) => {
    if (!message.method) {
      return;
    }
    if (message.method.startsWith('tabs.')) {
      return singlefile.extension.core.bg.tabs.onMessage(message, sender);
    }
    if (message.method.startsWith('downloads.')) {
      return singlefile.extension.core.bg.downloads.onMessage(message, sender);
    }
    if (message.method.startsWith('autosave.')) {
      return singlefile.extension.core.bg.autosave.onMessage(message, sender);
    }
    if (message.method.startsWith('ui.')) {
      return singlefile.extension.ui.bg.main.onMessage(message, sender);
    }
    if (message.method.startsWith('config.')) {
      return singlefile.extension.core.bg.config.onMessage(message, sender);
    }
    if (message.method.startsWith('tabsData.')) {
      return singlefile.extension.core.bg.tabsData.onMessage(message, sender);
    }
  });
  if (browser.runtime.onMessageExternal) {
    browser.runtime.onMessageExternal.addListener(async (message, sender) => {
      const allTabs = await singlefile.extension.core.bg.tabs.get({ currentWindow: true, active: true });
      const currentTab = allTabs[0];
      if (currentTab) {
        return singlefile.extension.core.bg.autosave.onMessageExternal(message, currentTab, sender);
      } else {
        return false;
      }
    });
  }
  return {};
})();
