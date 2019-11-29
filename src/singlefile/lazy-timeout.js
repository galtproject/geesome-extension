/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global singlefile, browser, setTimeout, clearTimeout */

singlefile.lib.lazy.bg.main = (() => {
  'use strict';

  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.method == 'lazyTimeout.setTimeout') {
      const timeoutId = setTimeout(async () => {
        try {
          await browser.tabs.sendMessage(sender.tab.id, { method: 'content.onLazyTimeout', id: timeoutId });
        } catch (error) {
          // ignored
        }
      }, message.delay);
      return Promise.resolve(timeoutId);
    }
    if (message.method == 'lazyTimeout.clearTimeout') {
      clearTimeout(message.id);
      return Promise.resolve({ id: message.id });
    }
  });
  return {};
})();
