import Vue from 'vue'
import App from './App'
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
import MescrollUni from '@/components/mescroll-uni/mescroll-uni';
Vue.config.productionTip = false
Vue.component('uniNavBar', uniNavBar);
Vue.component('MescrollUni', MescrollUni);
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
