import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import iView from 'iview';
import tool from './tool/index';
import 'iview/dist/styles/iview.css';
Vue.use(VueAxios, axios);
Vue.use(iView);
Vue.use(tool);
Vue.prototype.$copy = obj => JSON.parse(JSON.stringify(obj));
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
