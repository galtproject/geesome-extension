/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import Vue from 'vue';
import router from './router';

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/black-green-dark.css';
import './styles/main.scss';

import App from './App';

(global as any).browser = require('webextension-polyfill');

Vue.prototype.$browser = (global as any).browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
