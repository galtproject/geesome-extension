/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { addIpfsContentArray, saveContent } from '../../../../../services/backgroundGateway';
import ContentDetails from '../../../../directives/ContentDetails/ContentDetails';
import { StorageVars } from '../../../../../enum';
import { AppWallet } from '../../../../../services/data';

const pIteration = require('p-iteration');

export default {
  template: require('./LinkContent.html'),
  components: { ContentDetails },
  created() {
    this.$cyberD = AppWallet.getCyberDInstance();

    this.inputKeywordsStr = this.keywordsStr;
  },
  methods: {
    async link() {
      console.log('this.inputKeywordsStr', this.inputKeywordsStr);
      console.log('this.keywords', this.keywords);
      console.log('this.resultKeywords', this.resultKeywords);
      console.log('this.$route.query.keywords', this.$route.query.keywords);
      const keywordHashes = await addIpfsContentArray(this.resultKeywords);

      try {
        const results = await pIteration.mapSeries(keywordHashes, async keywordHash => {
          return this.$cyberD.link(
            {
              address: this.currentAccount.address,
              privateKey: await AppWallet.decryptByPassword(this.currentAccount.encryptedPrivateKey),
            },
            keywordHash,
            this.resultContentHash
          );
        });

        await saveContent({
          contentHash: this.resultContentHash,
          keywords: this.resultKeywords,
        });

        console.log('link results', results);

        this.$notify({
          type: 'success',
          text: 'Successfully linked',
        });

        this.$router.push({ name: 'cabinet-cyberd' });
      } catch (e) {
        console.error(e);
        this.$notify({
          type: 'error',
          title: e && e.message ? e.message : e || 'Unknown error',
          text: e && e.data ? e.data : '',
        });
      }
    },
  },
  computed: {
    resultContentHash() {
      return this.contentHash || this.inputContentHash;
    },
    resultKeywords() {
      return this.inputKeywordsStr.split(/[ ,]+/);
    },
    contentHash() {
      return this.$route.query.contentHash;
    },
    keywords() {
      return _.isArray(this.$route.query.keywords) ? this.$route.query.keywords : this.$route.query.keywords ? this.$route.query.keywords.split(/[ ,]+/) : null;
    },
    keywordsStr() {
      return this.keywords ? this.keywords.join(', ') : '';
    },
    currentAccount() {
      return this.$store.state[StorageVars.CurrentAccountItem];
    },
    disableLink() {
      return !(this.contentHash || this.inputContentHash) || !(this.keywordsStr || this.inputKeywordsStr);
    },
  },
  data() {
    return {
      contentDetails: null,
      inputContentHash: '',
      inputDescription: '',
      inputKeywordsStr: '',
      saveToGeesome: false,
    };
  },
};
