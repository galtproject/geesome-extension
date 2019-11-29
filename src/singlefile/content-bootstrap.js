/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global browser, window, addEventListener, removeEventListener, document, location, setTimeout */

this.singlefile.extension.core.content.bootstrap =
  this.singlefile.extension.core.content.bootstrap ||
  (async () => {
    const singlefile = this.singlefile;

    let unloadListenerAdded, options, autoSaveEnabled, autoSaveTimeout, autoSavingPage, pageAutoSaved;
    browser.runtime.sendMessage({ method: 'autosave.init' }).then(message => {
      options = message.options;
      autoSaveEnabled = message.autoSaveEnabled;
      refresh();
    });
    browser.runtime.onMessage.addListener(message => {
      onMessage(message);
    });
    browser.runtime.sendMessage({ method: 'ui.processInit' });
    addEventListener('single-file-push-state', () => browser.runtime.sendMessage({ method: 'ui.processInit' }));
    return {};

    async function onMessage(message) {
      if (autoSaveEnabled && message.method == 'content.autosave') {
        options = message.options;
        await autoSavePage();
        if (options.autoSaveRepeat) {
          setTimeout(() => {
            if (autoSaveEnabled && !autoSavingPage) {
              pageAutoSaved = false;
              options.autoSaveDelay = 0;
              onMessage(message);
            }
          }, options.autoSaveRepeatDelay * 1000);
        }
      }
      if (message.method == 'content.init') {
        options = message.options;
        autoSaveEnabled = message.autoSaveEnabled;
        refresh();
      }
    }

    async function autoSavePage() {
      const helper = singlefile.lib.helper;
      if ((!autoSavingPage || autoSaveTimeout) && !pageAutoSaved) {
        autoSavingPage = true;
        if (options.autoSaveDelay && !autoSaveTimeout) {
          await new Promise(resolve => (autoSaveTimeout = setTimeout(resolve, options.autoSaveDelay * 1000)));
          await autoSavePage();
        } else {
          const docData = helper.preProcessDoc(document, window, options);
          let frames = [];
          autoSaveTimeout = null;
          if (!options.removeFrames && singlefile.lib.frameTree.content.frames) {
            frames = await singlefile.lib.frameTree.content.frames.getAsync(options);
          }
          browser.runtime.sendMessage({
            method: 'autosave.save',
            content: helper.serialize(document, false),
            canvases: docData.canvases,
            fonts: docData.fonts,
            stylesheets: docData.stylesheets,
            images: docData.images,
            posters: docData.posters,
            usedFonts: docData.usedFonts,
            shadowRoots: docData.shadowRoots,
            imports: docData.imports,
            referrer: docData.referrer,
            frames: frames,
            url: location.href,
          });
          helper.postProcessDoc(document, docData.markedElements);
          pageAutoSaved = true;
          autoSavingPage = false;
        }
      }
    }

    async function refresh() {
      if (autoSaveEnabled && options && (options.autoSaveUnload || options.autoSaveLoadOrUnload)) {
        if (!unloadListenerAdded) {
          addEventListener('unload', onUnload);
          addEventListener('single-file-push-state', onUnload);
          unloadListenerAdded = true;
        }
      } else {
        removeEventListener('unload', onUnload);
        removeEventListener('single-file-push-state', onUnload);
        unloadListenerAdded = false;
      }
    }

    function onUnload() {
      const helper = singlefile.lib.helper;
      if (!pageAutoSaved || options.autoSaveUnload) {
        const docData = helper.preProcessDoc(document, window, options);
        let frames = [];
        if (!options.removeFrames && singlefile.lib.frameTree.content.frames) {
          frames = singlefile.lib.frameTree.content.frames.getSync(options);
        }
        browser.runtime.sendMessage({
          method: 'autosave.save',
          content: helper.serialize(document),
          canvases: docData.canvases,
          fonts: docData.fonts,
          stylesheets: docData.stylesheets,
          images: docData.images,
          posters: docData.posters,
          usedFonts: docData.usedFonts,
          shadowRoots: docData.shadowRoots,
          imports: docData.imports,
          referrer: docData.referrer,
          frames: frames,
          url: location.href,
        });
      }
    }
  })();
