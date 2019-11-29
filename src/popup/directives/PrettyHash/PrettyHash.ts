/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { StorageVars } from '../../../enum';

export default {
  name: 'pretty-hash',
  template: require('./PrettyHash.html'),
  // components: { NetworkSelectInput, AccountSelectInput },
  props: ['hash'],
  created() {
    // this.search = this.$route.query.search || '';
  },
  computed: {
    link() {
      if (this.hash.length > 46) {
        return 'http://geesome.galtproject.io/#/content/' + this.hash;
      } else {
        return this.ipfsUrl + this.hash;
      }
    },
    ipfsUrl() {
      // return this.$store.state[StorageVars.ExtensionTabPageUrl] + '#/';
      return this.$store.state[StorageVars.IpfsUrl];
    },
  },
  data() {
    return {};
  },
};
