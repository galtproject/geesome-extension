/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import Vue from 'vue';
import * as Vuex from 'vuex';
import * as _ from 'lodash';
import * as pIteration from 'p-iteration';
import { PermanentStorage } from './data';
import { StorageVars } from '../enum';

Vue.use(Vuex as any);

export default {
  install(Vue, options) {
    options.ready = false;

    const keys = [];
    const mutations = {};
    _.forEach(options, (value, key) => {
      keys.push(key);
      mutations[key] = (state, newValue) => {
        console.log('commit', key, newValue);
        state[key] = newValue;
        PermanentStorage.setValue(key, newValue);
      };
    });

    const $store = new Vuex.Store({
      state: options,
      mutations,
    });

    Vue.prototype.$store = $store;

    pIteration
      .forEach(keys, async key => {
        let value: any = await PermanentStorage.getValue(key);
        if (value) {
          try {
            value = JSON.parse(value);
          } catch (e) {}
          $store.commit(key, value);
        }
      })
      .then(() => {
        $store.commit(StorageVars.Ready, true);
      });
  },
};
