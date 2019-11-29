/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { AppWallet } from '../../../../services/data';

const appConfig = require('../../../../config');

export default {
  template: require('./ImportWallet.html'),
  created() {
    // this.seedPhrase = AppWallet.generateSeed();
  },
  methods: {
    async save() {
      await AppWallet.setSeed(this.seedPhrase, this.password);

      const group = await AppWallet.addAccountGroup(appConfig.baseAccountsGroupTitle);
      await AppWallet.generateBaseCoinsForAccountGroup(group.id);

      await AppWallet.setCurrentAccountGroup(group);

      this.$router.push({ name: 'cabinet-geesome' });
    },
  },
  computed: {
    saveDisabled() {
      return !this.seedPhrase || !this.password || this.password.length < 8 || this.password !== this.confirmPassword;
    },
  },
  data() {
    return {
      seedPhrase: '',
      password: '',
      confirmPassword: '',
    };
  },
};
