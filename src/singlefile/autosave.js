/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global singlefile, URL, Blob */

singlefile.extension.core.bg.autosave = (() => {
  return {
    onMessage,
    onMessageExternal,
    onTabUpdated,
    isEnabled,
    refreshTabs,
  };

  async function onMessage(message, sender) {
    const ui = singlefile.extension.ui.bg.main;
    if (message.method.endsWith('.init')) {
      const [options, autoSaveEnabled] = await Promise.all([singlefile.extension.core.bg.config.getOptions(sender.tab.url, true), isEnabled(sender.tab)]);
      return { options, autoSaveEnabled };
    }
    if (message.method.endsWith('.save')) {
      ui.onStart(sender.tab.id, 1, true);
      await saveContent(message, sender.tab);
      ui.onEnd(sender.tab.id, true);
      return {};
    }
  }

  async function onMessageExternal(message, currentTab) {
    if (message.method == 'enableAutoSave') {
      const tabsData = await singlefile.extension.core.bg.tabsData.get(currentTab.id);
      tabsData[currentTab.id].autoSave = message.enabled;
      await singlefile.extension.core.bg.tabsData.set(tabsData);
      singlefile.extension.ui.bg.main.refreshTab(currentTab);
    }
    if (message.method == 'isAutoSaveEnabled') {
      return isEnabled(currentTab);
    }
  }

  async function onTabUpdated(tabId, changeInfo, tab) {
    const [options, autoSaveEnabled] = await Promise.all([singlefile.extension.core.bg.config.getOptions(tab.url, true), isEnabled(tab)]);
    if (options && ((options.autoSaveLoad || options.autoSaveLoadOrUnload) && autoSaveEnabled)) {
      if (changeInfo.status == 'complete') {
        singlefile.extension.core.bg.business.saveTab(tab, { autoSave: true });
      }
    }
  }

  async function isEnabled(tab) {
    const config = singlefile.extension.core.bg.config;
    if (tab) {
      const [tabsData, rule] = await Promise.all([singlefile.extension.core.bg.tabsData.get(), config.getRule(tab.url)]);
      return (
        Boolean(tabsData.autoSaveAll || (tabsData.autoSaveUnpinned && !tab.pinned) || (tabsData[tab.id] && tabsData[tab.id].autoSave)) &&
        (!rule || rule.autoSaveProfile != config.DISABLED_PROFILE_NAME)
      );
    }
  }

  async function refreshTabs() {
    const tabs = singlefile.extension.core.bg.tabs;
    const allTabs = await singlefile.extension.core.bg.tabs.get({});
    return Promise.all(
      allTabs.map(async tab => {
        const [options, autoSaveEnabled] = await Promise.all([singlefile.extension.core.bg.config.getOptions(tab.url, true), isEnabled(tab)]);
        try {
          await tabs.sendMessage(tab.id, { method: 'content.init', autoSaveEnabled, options });
        } catch (error) {
          // ignored
        }
      })
    );
  }

  async function saveContent(message, tab) {
    const options = await singlefile.extension.core.bg.config.getOptions(tab.url, true);
    const tabId = tab.id;
    options.content = message.content;
    options.url = message.url;
    options.frames = message.frames;
    options.canvases = message.canvases;
    options.fonts = message.fonts;
    options.stylesheets = message.stylesheets;
    options.images = message.images;
    options.posters = message.posters;
    options.usedFonts = message.usedFonts;
    options.shadowRoots = message.shadowRoots;
    options.imports = message.imports;
    options.referrer = message.referrer;
    options.insertSingleFileComment = true;
    options.insertFaviconLink = true;
    options.backgroundTab = true;
    options.autoSave = true;
    options.incognito = tab.incognito;
    options.tabId = tabId;
    options.tabIndex = tab.index;
    const processor = new (singlefile.lib.SingleFile.getClass())(options);
    await processor.run();
    const page = await processor.getPageData();
    page.url = URL.createObjectURL(new Blob([page.content], { type: 'text/html' }));
    try {
      await singlefile.extension.core.bg.downloads.downloadPage(page, options);
    } finally {
      URL.revokeObjectURL(page.url);
    }
  }
})();
