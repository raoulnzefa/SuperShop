import Vue from 'vue'
import App from './App.vue'
import Bootstrap from 'bootstrap'
import VueHolder from 'vue-holderjs'
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'open-iconic/font/css/open-iconic-bootstrap.css'

Vue.use(VueHolder);

new Vue({
  el: '#app',
  render: h => h(App)
});
