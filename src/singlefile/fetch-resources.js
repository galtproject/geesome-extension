/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global singlefile, browser, XMLHttpRequest */

singlefile.lib.fetch.bg.resources = (() => {
  const responses = new Map();

  let requestId = 1;

  browser.runtime.onMessage.addListener(message => {
    if (!message.method) {
      return;
    }
    if (message.method.startsWith('fetch')) {
      return new Promise(resolve => {
        onRequest(message)
          .then(resolve)
          .catch(error => resolve({ error: error.toString() }));
      });
    }
  });
  return {};

  async function onRequest(message) {
    if (message.method == 'fetch') {
      const responseId = requestId;
      requestId = requestId + 1;
      const response = await fetchResource(message.url);
      responses.set(responseId, response);
      response.responseId = responseId;
      return { responseId, headers: response.headers };
    } else if (message.method == 'fetch.array') {
      const response = responses.get(message.requestId);
      responses.delete(response.requestId);
      return new Promise((resolve, reject) => {
        response.xhrRequest.onerror = event => reject(new Error(event.detail));
        if (response.xhrRequest.readyState == XMLHttpRequest.DONE) {
          resolve(getResponse(response.xhrRequest));
        } else {
          response.xhrRequest.onload = () => resolve(getResponse(response.xhrRequest));
        }
      });
    }
  }

  function getResponse(xhrRequest) {
    return { array: Array.from(new Uint8Array(xhrRequest.response)) };
  }

  async function fetchResource(url) {
    return new Promise((resolve, reject) => {
      const xhrRequest = new XMLHttpRequest();
      xhrRequest.withCredentials = true;
      xhrRequest.responseType = 'arraybuffer';
      xhrRequest.onerror = event => reject(new Error(event.detail));
      xhrRequest.onreadystatechange = () => {
        if (xhrRequest.readyState == XMLHttpRequest.HEADERS_RECEIVED) {
          const headers = {};
          headers['content-type'] = xhrRequest.getResponseHeader('Content-Type');
          resolve({ xhrRequest, headers, status: xhrRequest.status });
        }
      };
      xhrRequest.open('GET', url, true);
      xhrRequest.send();
    });
  }
})();
