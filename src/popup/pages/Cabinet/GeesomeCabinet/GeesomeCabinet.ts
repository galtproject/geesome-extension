export default {
  template: require('./GeesomeCabinet.html'),
  methods: {
    downloadPage() {
      (global as any).chrome.runtime.sendMessage({ type: 'download-page' }, response => {});
    },
  },
  data() {
    return {};
  },
};
