/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global browser, singlefile */

singlefile.extension.ui.bg.commands = (() => {
  const commands = browser.commands;
  const BROWSER_COMMANDS_API_SUPPORTED = commands && commands.onCommand && commands.onCommand.addListener;

  if (BROWSER_COMMANDS_API_SUPPORTED) {
    commands.onCommand.addListener(async command => {
      if (command == 'save-all-tabs') {
        const allTabs = await singlefile.extension.core.bg.tabs.get({ currentWindow: true });
        allTabs.forEach(tab => singlefile.extension.core.bg.business.saveTab(tab));
      }
    });
  }
})();
