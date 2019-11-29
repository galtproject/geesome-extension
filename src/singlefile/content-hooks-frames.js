/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global browser, addEventListener, dispatchEvent, CustomEvent, document, HTMLDocument */

this.singlefile.lib.hooks.content.frames =
  this.singlefile.lib.hooks.content.frames ||
  (() => {
    const LOAD_DEFERRED_IMAGES_START_EVENT = 'single-file-load-deferred-images-start';
    const LOAD_DEFERRED_IMAGES_END_EVENT = 'single-file-load-deferred-images-end';
    const LOAD_IMAGE_EVENT = 'single-file-load-image';
    const IMAGE_LOADED_EVENT = 'single-file-image-loaded';
    const NEW_FONT_FACE_EVENT = 'single-file-new-font-face';
    const fontFaces = [];

    if (document instanceof HTMLDocument) {
      let scriptElement = document.createElement('script');
      if (this.browser && browser.runtime && browser.runtime.getURL) {
        scriptElement.src = browser.runtime.getURL('/lib/hooks/content/content-hooks-frames-web.js');
        scriptElement.async = false;
      } else if (this.singlefile.lib.getFileContent) {
        scriptElement.textContent = this.singlefile.lib.getFileContent('/lib/hooks/content/content-hooks-frames-web.js');
      }
      (document.documentElement || document).appendChild(scriptElement);
      scriptElement.remove();
      addEventListener(NEW_FONT_FACE_EVENT, event => fontFaces.push(event.detail));
    }

    return {
      getFontsData: () => fontFaces,
      loadDeferredImagesStart: () => dispatchEvent(new CustomEvent(LOAD_DEFERRED_IMAGES_START_EVENT)),
      loadDeferredImagesEnd: () => dispatchEvent(new CustomEvent(LOAD_DEFERRED_IMAGES_END_EVENT)),
      LOAD_IMAGE_EVENT,
      IMAGE_LOADED_EVENT,
    };
  })();
