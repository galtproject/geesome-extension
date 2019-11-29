/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

this.singlefile.lib.modules.mediasAltMinifier =
  this.singlefile.lib.modules.mediasAltMinifier ||
  (() => {
    const singlefile = this.singlefile;

    const MEDIA_ALL = 'all';
    const MEDIA_SCREEN = 'screen';

    return {
      process: stylesheets => {
        const stats = { processed: 0, discarded: 0 };
        stylesheets.forEach((stylesheetInfo, element) => {
          if (matchesMediaType(stylesheetInfo.mediaText || MEDIA_ALL, MEDIA_SCREEN) && stylesheetInfo.stylesheet.children) {
            const removedRules = processRules(stylesheetInfo.stylesheet.children, stats);
            removedRules.forEach(({ cssRules, cssRule }) => cssRules.remove(cssRule));
          } else {
            stylesheets.delete(element);
          }
        });
        return stats;
      },
    };

    function processRules(cssRules, stats, removedRules = []) {
      for (let cssRule = cssRules.head; cssRule; cssRule = cssRule.next) {
        const ruleData = cssRule.data;
        if (ruleData.type == 'Atrule' && ruleData.name == 'media' && ruleData.block && ruleData.block.children && ruleData.prelude && ruleData.prelude.children) {
          stats.processed++;
          if (matchesMediaType(singlefile.lib.vendor.cssTree.generate(ruleData.prelude), MEDIA_SCREEN)) {
            processRules(ruleData.block.children, stats, removedRules);
          } else {
            removedRules.push({ cssRules, cssRule });
            stats.discarded++;
          }
        }
      }
      return removedRules;
    }

    function flatten(array) {
      return array.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
    }

    function matchesMediaType(mediaText, mediaType) {
      const foundMediaTypes = flatten(singlefile.lib.vendor.mediaQueryParser.parseMediaList(mediaText).map(node => getMediaTypes(node, mediaType)));
      return foundMediaTypes.find(
        mediaTypeInfo =>
          (!mediaTypeInfo.not && (mediaTypeInfo.value == mediaType || mediaTypeInfo.value == MEDIA_ALL)) ||
          (mediaTypeInfo.not && (mediaTypeInfo.value == MEDIA_ALL || mediaTypeInfo.value != mediaType))
      );
    }

    function getMediaTypes(parentNode, mediaType, mediaTypes = []) {
      parentNode.nodes.map((node, indexNode) => {
        if (node.type == 'media-query') {
          return getMediaTypes(node, mediaType, mediaTypes);
        } else {
          if (node.type == 'media-type') {
            const nodeMediaType = { not: Boolean(indexNode && parentNode.nodes[0].type == 'keyword' && parentNode.nodes[0].value == 'not'), value: node.value };
            if (!mediaTypes.find(mediaType => nodeMediaType.not == mediaType.not && nodeMediaType.value == mediaType.value)) {
              mediaTypes.push(nodeMediaType);
            }
          }
        }
      });
      if (!mediaTypes.length) {
        mediaTypes.push({ not: false, value: MEDIA_ALL });
      }
      return mediaTypes;
    }
  })();
