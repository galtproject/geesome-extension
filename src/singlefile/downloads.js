/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global browser, singlefile, Blob, URL, document */

singlefile.extension.core.bg.downloads = (() => {
  const partialContents = new Map();
  const MIMETYPE_HTML = 'text/html';
  const STATE_DOWNLOAD_COMPLETE = 'complete';
  const STATE_DOWNLOAD_INTERRUPTED = 'interrupted';
  const STATE_ERROR_CANCELED_CHROMIUM = 'USER_CANCELED';
  const ERROR_DOWNLOAD_CANCELED_GECKO = 'canceled';
  const ERROR_CONFLICT_ACTION_GECKO = 'conflictaction prompt not yet implemented';
  const ERROR_INCOGNITO_GECKO = "'incognito'";
  const ERROR_INCOGNITO_GECKO_ALT = '"incognito"';
  const ERROR_INVALID_FILENAME_GECKO = 'illegal characters';
  const ERROR_INVALID_FILENAME_CHROMIUM = 'invalid filename';

  return {
    onMessage,
    download,
    downloadPage,
  };

  async function onMessage(message, sender) {
    // download implemented in another place, you can search ut by .endsWith('.download') query
    return;
    if (message.method.endsWith('.download')) {
      let contents;
      if (message.truncated) {
        contents = partialContents.get(sender.tab.id);
        if (!contents) {
          contents = [];
          partialContents.set(sender.tab.id, contents);
        }
        contents.push(message.content);
        if (message.finished) {
          partialContents.delete(sender.tab.id);
        }
      } else if (message.content) {
        contents = [message.content];
      }
      if (!message.truncated || message.finished) {
        if (message.saveToClipboard) {
          message.content = contents.join('');
          saveToClipboard(message);
        } else {
          message.url = URL.createObjectURL(new Blob([contents], { type: MIMETYPE_HTML }));
          try {
            await downloadPage(message, {
              confirmFilename: message.confirmFilename,
              incognito: sender.tab.incognito,
              filenameConflictAction: message.filenameConflictAction,
              filenameReplacementCharacter: message.filenameReplacementCharacter,
            });
          } catch (error) {
            console.error(error); // eslint-disable-line no-console
            singlefile.extension.ui.bg.main.onError(sender.tab.id);
          } finally {
            URL.revokeObjectURL(message.url);
          }
        }
      }
      return {};
    }
  }

  async function downloadPage(page, options) {
    const downloadInfo = {
      url: page.url,
      saveAs: options.confirmFilename,
      filename: page.filename,
      conflictAction: options.filenameConflictAction,
    };
    if (options.incognito) {
      downloadInfo.incognito = true;
    }
    await download(downloadInfo, options.filenameReplacementCharacter);
  }

  async function download(downloadInfo, replacementCharacter) {
    let downloadId;
    try {
      downloadId = await browser.downloads.download(downloadInfo);
    } catch (error) {
      if (error.message) {
        const errorMessage = error.message.toLowerCase();
        const invalidFilename = errorMessage.includes(ERROR_INVALID_FILENAME_GECKO) || errorMessage.includes(ERROR_INVALID_FILENAME_CHROMIUM);
        if (invalidFilename && downloadInfo.filename.startsWith('.')) {
          downloadInfo.filename = replacementCharacter + downloadInfo.filename;
          return download(downloadInfo, replacementCharacter);
        } else if (invalidFilename && downloadInfo.filename.includes(',')) {
          downloadInfo.filename = downloadInfo.filename.replace(/,/g, replacementCharacter);
          return download(downloadInfo, replacementCharacter);
        } else if (invalidFilename && !downloadInfo.filename.match(/^[\x00-\x7F]+$/)) {
          // eslint-disable-line  no-control-regex
          downloadInfo.filename = downloadInfo.filename.replace(/[^\x00-\x7F]+/g, replacementCharacter); // eslint-disable-line  no-control-regex
          return download(downloadInfo, replacementCharacter);
        } else if ((errorMessage.includes(ERROR_INCOGNITO_GECKO) || errorMessage.includes(ERROR_INCOGNITO_GECKO_ALT)) && downloadInfo.incognito) {
          delete downloadInfo.incognito;
          return download(downloadInfo, replacementCharacter);
        } else if (errorMessage == ERROR_CONFLICT_ACTION_GECKO && downloadInfo.conflictAction) {
          delete downloadInfo.conflictAction;
          return download(downloadInfo, replacementCharacter);
        } else if (errorMessage.includes(ERROR_DOWNLOAD_CANCELED_GECKO)) {
          return {};
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
    return new Promise((resolve, reject) => {
      browser.downloads.onChanged.addListener(onChanged);

      function onChanged(event) {
        if (event.id == downloadId && event.state) {
          if (event.state.current == STATE_DOWNLOAD_COMPLETE) {
            resolve({});
            browser.downloads.onChanged.removeListener(onChanged);
          }
          if (event.state.current == STATE_DOWNLOAD_INTERRUPTED) {
            if (event.error && event.error.current == STATE_ERROR_CANCELED_CHROMIUM) {
              resolve({});
            } else {
              reject(new Error(event.state.current));
            }
            browser.downloads.onChanged.removeListener(onChanged);
          }
        }
      }
    });
  }

  function saveToClipboard(page) {
    const command = 'copy';
    document.addEventListener(command, listener);
    document.execCommand(command);
    document.removeEventListener(command, listener);

    function listener(event) {
      event.clipboardData.setData(MIMETYPE_HTML, page.content);
      event.clipboardData.setData('text/plain', page.content);
      event.preventDefault();
    }
  }
})();
