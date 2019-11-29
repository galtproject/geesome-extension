/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

(global as any).browser = require('webextension-polyfill');

const chrome = (global as any).chrome;
const browser = (global as any).browser;

module.exports = {
  setBadgeText: data => chrome.browserAction.setBadgeText(data),
  onMessage: (request, sender, sendResponse) => browser.runtime.onMessage.addListener(request, sender, sendResponse),
  sendTabMessage: (tabId, data) => chrome.tabs.sendMessage(tabId, data),
  sendPopupMessage: data => chrome.runtime.sendMessage(data),
  getCurrentTab: () => new Promise((resolve, reject) => chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0]))),
};
