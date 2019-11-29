/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { getSettingData, Settings } from '../../../../backgroundServices/types';
import EthData from '@galtproject/frontend-core/libs/EthData';
import { StorageVars } from '../../../../enum';

export default {
  template: require('./Backup.html'),
  created() {},
  methods: {},
  watch: {},
  computed: {
    settingList() {
      return this.names.map(name => {
        return {
          name,
          title: EthData.humanizeKey(name),
          data: getSettingData(name),
        };
      });
    },
    values() {
      return this.$store.state[StorageVars.Settings] || {};
    },
    backupError() {
      return this.values && this.values[Settings.StorageExtensionIpldError];
    },
    loading() {
      return !this.values;
    },
  },
  data() {
    return {
      names: [Settings.StorageExtensionIpld, Settings.StorageExtensionIpldUpdatedAt, Settings.StorageExtensionIpnsUpdatedAt],
    };
  },
};
