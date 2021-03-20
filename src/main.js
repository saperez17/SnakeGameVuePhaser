import { defineCustomElements as defineIonPhaser } from '@ion-phaser/core/loader';
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import VueAxios from 'vue-axios'
// import Phaser from 'phaser'/

// socket io
import * as io from "socket.io-client";
import VueSocketIO from "vue-socket.io";


Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io('http://localhost:8090'), // options object is Optional
  })
);
Vue.use(VueAxios, axios)


Vue.config.ignoredElements = [/ion-\w*/];

defineIonPhaser(window);

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
