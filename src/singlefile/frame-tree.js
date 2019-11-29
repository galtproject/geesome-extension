/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global singlefile, browser */

singlefile.lib.frameTree.bg.main = (() => {
  'use strict';

  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.method == 'frameTree.initResponse') {
      browser.tabs.sendMessage(sender.tab.id, message, { frameId: 0 });
      return Promise.resolve({});
    }
  });
  return {};
})();
