/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { KeyPairType, NetworkType, StorageVars } from '../../../../../enum';
import { AppWallet } from '../../../../../services/data';

export default {
  template: require('./ImportAccount.html'),
  methods: {
    async importAccount() {
      if (this.importMethod === 'privateKey') {
        const account = await AppWallet.getAccountByPrivateKey(KeyPairType.Cosmos, this.privateKey);
        await AppWallet.addAccount(this.currentAccountGroup.id, NetworkType.Cosmos, KeyPairType.Cosmos, account.address, account.privateKey);
        this.$router.push({ name: 'cabinet-cosmos' });
      }
    },
  },
  computed: {
    currentAccountGroup() {
      return this.$store.state[StorageVars.CurrentAccountGroup];
    },
  },
  data() {
    return {
      methodList: [{ title: 'Private Key', value: 'privateKey' }],
      importMethod: 'privateKey',
      privateKey: '',
    };
  },
};
