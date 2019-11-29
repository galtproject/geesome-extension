/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { getContentByHash } from '../../../services/backgroundGateway';

export default {
  name: 'content-details',
  template: require('./ContentDetails.html'),
  props: ['hash'],
  async created() {
    this.details = await getContentByHash(this.hash);
  },
  watch: {
    async hash() {
      this.details = await getContentByHash(this.hash);
    },
  },
  computed: {},
  data() {
    return {
      details: null,
    };
  },
};
