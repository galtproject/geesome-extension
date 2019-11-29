/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import { EventBus, NETWORK_SELECT_HIDE, NETWORK_SELECT_PREVENT_CLOSE, NETWORK_SELECT_SHOW } from '../../../../services/events';

export default {
  name: 'network-select-input',
  template: require('./NetworkSelectInput.html'),
  props: ['value', 'disabled', 'emptyLabel', 'items'],
  async created() {
    this.uniqId = Math.random()
      .toString(36)
      .substr(2, 9);

    EventBus.$on(NETWORK_SELECT_PREVENT_CLOSE, data => {
      if (this.uniqId != data.uniqId) return;

      this.preventClose();
    });
  },
  mounted() {
    document.body.addEventListener('click', () => {
      this.onClickOutside();
    });

    this.$refs.input.addEventListener('click', () => {
      this.preventClose();
    });
  },
  methods: {
    openContainer() {
      if (this.showList) return;

      EventBus.$emit(NETWORK_SELECT_SHOW, {
        uniqId: this.uniqId,
        input: this.$refs.input,
        value: this.value,
      });

      this.showList = true;
    },
    onClickOutside() {
      setTimeout(() => {
        if (this.isPreventClose) {
          return;
        }
        this.showList = false;
        EventBus.$emit(NETWORK_SELECT_HIDE, { uniqId: this.uniqId });
      }, 200);
    },
    preventClose() {
      this.isPreventClose = true;
      setTimeout(() => {
        this.isPreventClose = false;
      }, 300);
    },
    updateValue(value) {
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
  watch: {
    '$route.name'() {
      this.showList = false;
      EventBus.$emit(NETWORK_SELECT_HIDE, { uniqId: this.uniqId });
    },
  },
  computed: {},
  data() {
    return {};
  },
};
