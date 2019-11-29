/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

export {};

const CID = require('cids');
const _ = require('lodash');

module.exports = {
  isIpfsHash(value) {
    if (!value) {
      return false;
    }
    return _.startsWith(value, 'Qm');
  },
  isIpldHash(value) {
    if (!value) {
      return false;
    }
    return _.startsWith(value.codec, 'dag-') || (_.isString(value) && (_.startsWith(value, 'zd') || _.startsWith(value, 'ba')));
  },
  isCid(value) {
    return CID.isCID(value);
  },
  cidToHash(cid) {
    const cidsResult = new CID(1, 'dag-cbor', cid.multihash || Buffer.from(cid.hash.data));
    return cidsResult.toBaseEncodedString();
  },
};
