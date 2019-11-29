/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { AppWallet } from '../../../../services/data';
import Helper from '@galtproject/frontend-core/services/helper';

const appConfig = require('../../../../config');

export default {
  template: require('./CreateWallet.html'),
  created() {
    this.seedPhrase = AppWallet.generateSeed();
  },
  methods: {
    async save() {
      await AppWallet.setSeed(this.seedPhrase, this.password);
      const group = await AppWallet.addAccountGroup(appConfig.baseAccountsGroupTitle);
      await AppWallet.generateBaseCoinsForAccountGroup(group.id);

      AppWallet.setCurrentAccountGroup(group);

      this.$router.push({ name: 'cabinet-geesome' });
    },
    copyToClipboard() {
      Helper.copyToClipboard(this.seedPhrase);
      this.$notify({
        type: 'success',
        title: 'Copied to clipboard!',
      });
    },
  },
  computed: {
    saveDisabled() {
      return !this.savedConfirm || !this.password || this.password.length < 8 || this.password !== this.confirmPassword;
    },
  },
  data() {
    return {
      seedPhrase: null,
      savedConfirm: false,
      password: '',
      confirmPassword: '',
    };
  },
};
