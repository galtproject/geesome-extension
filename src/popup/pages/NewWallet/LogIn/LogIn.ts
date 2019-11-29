/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { AppWallet, PermanentStorage } from '../../../../services/data';
import { StorageVars } from '../../../../enum';

const cybCrypto = require('../../../../crypto');

export default {
  template: require('./LogIn.html'),
  async created() {
    this.encryptedSeed = await PermanentStorage.getValue(StorageVars.EncryptedSeed);
  },
  methods: {
    async login() {
      await AppWallet.setPassword(this.password);
      this.$router.push({ name: 'cabinet-geesome' });
    },
  },
  computed: {
    loginDisabled() {
      if (!this.password || !this.encryptedSeed) {
        return true;
      }
      try {
        cybCrypto.decrypt(this.encryptedSeed, this.password);
      } catch (e) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      password: '',
    };
  },
};
