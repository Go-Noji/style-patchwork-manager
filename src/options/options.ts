import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import AppContainer from "@/options/components/AppContainer";
import router from "@/options/router"

Vue.use(VueCompositionApi);

new Vue({
  router,

  //CSP 環境で動かすために render 関数を使用
  render(createElement) {
    return createElement(AppContainer);
  }
}).$mount('#app');
