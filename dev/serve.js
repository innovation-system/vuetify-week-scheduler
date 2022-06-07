import Vue from 'vue';
import Dev from './serve.vue';
import vuetify from '../src/vuetify';
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(Dev),
}).$mount('#app');
