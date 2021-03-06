import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import AppContainer from "@/options/components/AppContainer.vue";
import router from "@/options/router"
import 'sanitize.css/sanitize.css';
import '@/options/style.scss'

Vue.use(VueCompositionApi);

new Vue({
  router,

  //CSP 環境で動かすために render 関数を使用
  render(createElement) {
    return createElement(AppContainer);
  }
}).$mount('#app');
