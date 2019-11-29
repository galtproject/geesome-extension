/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { getContentDataByHash } from '../../services/backgroundGateway';

export default {
  template: require('./IpfsContentPage.html'),
  components: {},
  async mounted() {
    const contentData = await getContentDataByHash(this.$route.params.ipfsHash);
    document.write(Buffer.from(contentData['data']).toString('utf8'));
  },
  data() {
    return {
      content: '',
    };
  },
};
