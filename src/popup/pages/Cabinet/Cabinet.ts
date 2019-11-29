/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import Toolbar from '../../directives/Toolbar/Toolbar';
import { AppWallet } from '../../../services/data';
import { StorageVars } from '../../../enum';

export default {
  template: require('./Cabinet.html'),
  components: { Toolbar },
  created() {
    this.accountAddress = this.accounts[0].address;
  },
  methods: {},
  watch: {
    accountAddress() {
      AppWallet.setCurrentAccountItem(_.find(this.accounts, { address: this.accountAddress }));
    },
    currentAccount() {
      const networkName = this.currentAccount.networkName;
      // this.$router.push({ name: 'cabinet-' + networkName });
    },
  },
  computed: {
    currentAccount() {
      return this.$store.state[StorageVars.CurrentAccountItem];
    },
    accounts() {
      return this.$store.state[StorageVars.CurrentAccountList] || [];
    },
  },
  data() {
    return {
      accountAddress: null,
    };
  },
};
