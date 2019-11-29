/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global browser, document, HTMLDocument */

this.singlefile.lib.hooks.content.main =
  this.singlefile.lib.hooks.content.main ||
  (() => {
    if (document instanceof HTMLDocument) {
      const scriptElement = document.createElement('script');
      scriptElement.async = false;
      if (this.browser && browser.runtime && browser.runtime.getURL) {
        scriptElement.src = browser.runtime.getURL('/lib/hooks/content/content-hooks-web.js');
        scriptElement.async = false;
      } else if (this.singlefile.lib.getFileContent) {
        scriptElement.textContent = this.singlefile.lib.getFileContent('/lib/hooks/content/content-hooks-web.js');
      }
      (document.documentElement || document).appendChild(scriptElement);
      scriptElement.remove();
    }
    return {};
  })();
