/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

/* global history, dispatchEvent, CustomEvent */

(() => {
  const pushState = history.pushState;
  let warningDisplayed;
  history.pushState = function(state, title, url) {
    if (!warningDisplayed) {
      warningDisplayed = true;
      console.warn('SingleFile is hooking the history.pushState API to detect navigation.'); // eslint-disable-line no-console
    }
    try {
      dispatchEvent(new CustomEvent('single-file-push-state', { detail: { state, title, url } }));
    } catch (error) {
      // ignored
    }
    pushState.call(history, state, title, url);
  };
  history.pushState.toString = function() {
    return 'function pushState() { [native code] }';
  };
})();
