/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { getContentList } from '../../../../../services/backgroundGateway';
import { StorageVars } from '../../../../../enum';

export default {
  template: require('./SavedContent.html'),
  created() {
    getContentList().then(data => {
      this.list = data;
      this.loading = false;
    });
  },
  methods: {},
  watch: {},
  computed: {
    ipfsUrl() {
      // return this.$store.state[StorageVars.ExtensionTabPageUrl] + '#/';
      return this.$store.state[StorageVars.IpfsUrl];
    },
  },
  data() {
    return {
      loading: true,
      list: [],
    };
  },
};
