/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import Vue from 'vue';
import storePlugin from '../services/permanentStore.plugin';

import { MdElevation, MdCheckbox, MdButton, MdIcon, MdField, MdMenu, MdList, MdDrawer } from 'vue-material/dist/components';
import { AppWallet, PermanentStorage } from '../services/data';
import NetworkSelectContainer from './directives/NetworkSelect/NetworkSelectContainer/NetworkSelectContainer';
import AccountSelectContainer from './directives/AccountSelect/AccountSelectContainer/AccountSelectContainer';
import PrettyHex from '@galtproject/frontend-core/directives/PrettyHex/PrettyHex';
import Notifications from 'vue-notification';
import PrettyHash from './directives/PrettyHash/PrettyHash';
import Loading from './directives/Loading/Loading';
import '@galtproject/frontend-core/filters';
import { getIsBackupExists, getSettings } from '../services/backgroundGateway';
import { Settings } from '../backgroundServices/types';
import { StorageVars } from '../enum';

Vue.use(Notifications);

Vue.use(MdCheckbox);
Vue.use(MdButton);
Vue.use(MdIcon);
Vue.use(MdField);
Vue.use(MdMenu);
Vue.use(MdList);
Vue.use(MdDrawer);

Vue.component('pretty-hex', PrettyHex);
Vue.component('pretty-hash', PrettyHash);
Vue.component('loading', Loading);

const ipRegex = require('ip-regex');

Vue.use(storePlugin, {
  [StorageVars.Ready]: false,

  [StorageVars.AccountsGroups]: null,
  [StorageVars.AllAccounts]: null,

  [StorageVars.CurrentAccountGroup]: null,
  [StorageVars.CurrentAccountList]: null,
  [StorageVars.CurrentAccountItem]: null,

  [StorageVars.Path]: null,
  [StorageVars.EncryptedSeed]: null,
  [StorageVars.IpfsUrl]: '/workers/ipfs/',
  // [StorageVars.CurrentAccounts]: null,
  // [StorageVars.NetworkList]: appConfig.baseNetworks.map((name) => ({name, title: EthData.humanizeKey(name)})),
  [StorageVars.IpfsUrl]: null,
  [StorageVars.CurrentCabinetRoute]: null,
  [StorageVars.Settings]: null,
  // [StorageVars.ExtensionTabPageUrl]: 'chrome-extension://' + (global as any).chrome.runtime.id + '/tab-page/index.html',
});

export default {
  template: require('./App.html'),
  components: { NetworkSelectContainer, AccountSelectContainer },

  async created() {
    (global as any).chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (!request || !request.type) {
        return;
      }
      console.log('request', request);
      if (request.type === 'loading') {
        this.loading = true;
      } else if (request.type === 'loading-end') {
        this.loading = false;
      } else if (request.type === 'page-action' && request.method === 'save-and-link') {
        this.$router.push({ name: 'cabinet-cyberd-save-and-link', query: request.data });
      } else if (request.type === 'page-action' && request.method === 'link') {
        this.$router.push({ name: 'cabinet-cyberd-link', query: request.data });
      }
    });

    this.init();
  },

  async mounted() {},

  methods: {
    async init() {
      if (!this.ready) {
        return;
      }
      this.loading = true;

      this.getSettings();

      AppWallet.setStore(this.$store);
      const path = await PermanentStorage.getValue(StorageVars.Path);
      console.log('path', path);
      if (path) {
        const query = JSON.parse((await PermanentStorage.getValue(StorageVars.Query)) as any);
        this.$router.push({ path, query });

        (global as any).chrome.runtime.sendMessage({ type: 'popup-get-action' });
        this.loading = false;
        return;
      }
      const encryptedSeed = await PermanentStorage.getValue(StorageVars.EncryptedSeed);

      if (!encryptedSeed) {
        this.loadingBackup = true;
        getIsBackupExists()
          .then(ipld => {
            if (!this.loadingBackup) {
              return;
            }
            this.loading = false;
            this.loadingBackup = false;
            if (ipld) {
              this.$router.push({ name: 'ask-restore-backup', query: { ipld } });
            } else {
              this.$router.push({ name: 'new-wallet-welcome' });
            }
          })
          .catch(() => {
            this.loading = false;
            this.loadingBackup = false;
            this.$router.push({ name: 'new-wallet-welcome' });
          });
        return;
        // return (global as any).chrome.tabs.create({url: (global as any).extension.getURL('popup.html#window')});
      }
    },
    getSettings() {
      console.log('getSettings');
      getSettings([
        Settings.StorageNodeAddress,
        Settings.StorageNodeType,
        Settings.StorageNodeKey,
        Settings.StorageExtensionIpld,
        Settings.StorageExtensionIpldUpdatedAt,
        Settings.StorageExtensionIpnsUpdatedAt,
        Settings.StorageExtensionIpldError,
      ]).then(settings => {
        console.log('settings', settings);
        this.$store.commit(StorageVars.Settings, settings);
      });
    },
  },

  watch: {
    '$route.name'() {
      if (this.$route.name === 'new-wallet-welcome' && this.loadingBackup) {
        this.loadingBackup = false;
        this.loading = false;
      }
      PermanentStorage.setValue(StorageVars.Path, this.$route.fullPath);
      this.getSettings();
    },
    '$route.query'() {
      PermanentStorage.setValue(StorageVars.Query, JSON.stringify(this.$route.query));
    },
    ready() {
      this.init();
    },
    nodeIp() {
      // this.$store.commit(StorageVars.IpfsUrl, 'http://' + this.nodeIp + ':8080/ipfs/');
    },
  },

  computed: {
    ready() {
      return this.$store.state[StorageVars.Ready];
    },
    nodeIp() {
      return this.settings && this.settings[Settings.StorageNodeAddress].match(ipRegex());
    },
    settings() {
      return this.$store.state[StorageVars.Settings];
    },
  },
  data() {
    return {
      loading: false,
      loadingBackup: false,
    };
  },
};
