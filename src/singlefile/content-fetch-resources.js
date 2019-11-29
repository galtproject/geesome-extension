/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global browser, fetch, XMLHttpRequest */

this.singlefile.lib.fetch.content.resources =
  this.singlefile.lib.fetch.content.resources ||
  (() => {
    return {
      fetch: async (url, options = {}) => {
        if (!options.referrerPolicy) {
          options.referrerPolicy = 'origin-when-cross-origin';
        }
        if (!options.credentials) {
          options.credentials = 'include';
        }
        try {
          let response = await fetch(url, { cache: 'force-cache' });
          if (response.status == 403) {
            response = await fetch(url, { cache: 'force-cache', referrerPolicy: options.referrerPolicy });
          }
          if (response.status == 403) {
            response = await fetch(url, { cache: 'force-cache', credentials: options.credentials, referrerPolicy: options.referrerPolicy });
          }
          if (response.status == 403) {
            response = await fetch(url, { cache: 'force-cache', mode: 'cors', credentials: options.credentials, referrerPolicy: options.referrerPolicy });
          }
          if (response.status == 403) {
            response = await xhrFetch(url);
          }
          return response;
        } catch (error) {
          const responseFetch = await sendMessage({ method: 'fetch', url });
          return {
            status: responseFetch.status,
            headers: { get: headerName => responseFetch.headers[headerName] },
            arrayBuffer: async () => {
              const response = await sendMessage({ method: 'fetch.array', requestId: responseFetch.responseId });
              return new Uint8Array(response.array).buffer;
            },
          };
        }
      },
    };

    async function sendMessage(message) {
      const response = await browser.runtime.sendMessage(message);
      if (!response || response.error) {
        throw new Error(response && response.error.toString());
      } else {
        return response;
      }
    }

    function xhrFetch(url) {
      return new Promise((resolve, reject) => {
        const xhrRequest = new XMLHttpRequest();
        xhrRequest.responseType = 'arraybuffer';
        xhrRequest.onerror = event => reject(new Error(event.detail));
        xhrRequest.onreadystatechange = () => {
          if (xhrRequest.readyState == XMLHttpRequest.HEADERS_RECEIVED || xhrRequest.readyState == XMLHttpRequest.DONE) {
            const headers = new Map();
            headers.set('content-type', xhrRequest.getResponseHeader('Content-Type'));
            resolve({
              status: xhrRequest.status,
              headers,
              arrayBuffer: () =>
                new Promise((resolve, reject) => {
                  xhrRequest.onerror = event => reject(new Error(event.detail));
                  if (xhrRequest.readyState == XMLHttpRequest.DONE) {
                    resolve(xhrRequest.response);
                  } else {
                    xhrRequest.onload = () => resolve(xhrRequest.response);
                  }
                }),
            });
          }
        };
        xhrRequest.open('GET', url, true);
        xhrRequest.send();
      });
    }
  })();
