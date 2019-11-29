/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { AppWallet, getIpfsHash } from '../../../../../services/data';
import EthData from '@galtproject/frontend-core/libs/EthData';

const _ = require('lodash');

export default {
  template: require('./Search.html'),
  created() {
    this.$cyberD = AppWallet.getCyberDInstance();

    this.debounceRunSearch = _.debounce(() => {
      this.loading = true;
      this.runSearch();
    }, 300);
    this.debounceRunSearch();
  },
  methods: {
    async runSearch() {
      console.log('runSearch', this.search);
      if (!this.search) {
        this.searchResults = [];
        this.loading = false;
        return;
      }
      this.searchResults = await this.$cyberD.search(await getIpfsHash(this.search));
      this.searchResults = this.searchResults.map(item => {
        item.rank = EthData.roundToDecimal(item.rank, 6);
        return item;
      });
      this.loading = false;
    },
  },
  watch: {
    async search() {
      this.debounceRunSearch();
    },
  },
  computed: {
    search() {
      return this.$route.query.search;
    },
  },
  data() {
    return {
      loading: true,
      searchResults: [],
    };
  },
};
