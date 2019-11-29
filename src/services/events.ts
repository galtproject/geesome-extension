/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import Vue from 'vue';

export const EventBus = new Vue();

export const NETWORK_SELECT_SHOW = 'network-select-show';
export const NETWORK_SELECT_HIDE = 'network-select-hide';
export const NETWORK_SELECT_PREVENT_CLOSE = 'network-select-prevent-close';

export const ACCOUNT_SELECT_SHOW = 'account-select-show';
export const ACCOUNT_SELECT_HIDE = 'account-select-hide';
export const ACCOUNT_SELECT_PREVENT_CLOSE = 'account-select-prevent-close';
export const ACCOUNT_SELECT_ITEM = 'account-select-item';
