/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global
	crypto,
	fetch,
	Blob,
	FileReader,
	TextDecoder,
	TextEncoder */

this.singlefile.lib.SingleFile =
  this.singlefile.lib.SingleFile ||
  (() => {
    const singlefile = this.singlefile;

    const modules = {
      helper: singlefile.lib.helper,
      srcsetParser: singlefile.lib.vendor.srcsetParser,
      cssMinifier: singlefile.lib.vendor.cssMinifier,
      htmlMinifier: singlefile.lib.modules.htmlMinifier,
      serializer: singlefile.lib.modules.serializer,
      fontsMinifier: singlefile.lib.modules.fontsMinifier,
      fontsAltMinifier: singlefile.lib.modules.fontsAltMinifier,
      cssRulesMinifier: singlefile.lib.modules.cssRulesMinifier,
      matchedRules: singlefile.lib.modules.matchedRules,
      mediasAltMinifier: singlefile.lib.modules.mediasAltMinifier,
      imagesAltMinifier: singlefile.lib.modules.imagesAltMinifier,
    };
    const util = {
      getResourceContent,
      digestText,
    };
    const SingleFile = singlefile.lib.core.getClass(singlefile.lib.util.getInstance(modules, util), singlefile.lib.vendor.cssTree);
    const fetchResource = (singlefile.lib.fetch.content.resources && singlefile.lib.fetch.content.resources.fetch) || fetch;
    return {
      getClass: () => SingleFile,
    };

    async function getResourceContent(resourceURL, options) {
      const resourceContent = await fetchResource(resourceURL, {
        referrerPolicy: options.referrerPolicy,
        credentials: options.credentials,
      });
      const buffer = await resourceContent.arrayBuffer();
      return {
        getUrl() {
          return resourceContent.url || resourceURL;
        },
        getContentType() {
          return resourceContent.headers && resourceContent.headers.get('content-type');
        },
        getStatusCode() {
          return resourceContent.status;
        },
        getSize() {
          return buffer.byteLength;
        },
        getText(charset) {
          return new TextDecoder(charset).decode(buffer);
        },
        async getDataUri(contentType) {
          const reader = new FileReader();
          reader.readAsDataURL(new Blob([buffer], { type: contentType || this.getContentType() }));
          return new Promise((resolve, reject) => {
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.addEventListener('error', reject, false);
          });
        },
      };
    }

    async function digestText(algo, text) {
      const hash = await crypto.subtle.digest(algo, new TextEncoder('utf-8').encode(text));
      return hex(hash);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    function hex(buffer) {
      const hexCodes = [];
      const view = new DataView(buffer);
      for (let i = 0; i < view.byteLength; i += 4) {
        const value = view.getUint32(i);
        const stringValue = value.toString(16);
        const padding = '00000000';
        const paddedValue = (padding + stringValue).slice(-padding.length);
        hexCodes.push(paddedValue);
      }
      return hexCodes.join('');
    }
  })();
