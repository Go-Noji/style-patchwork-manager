import Vue, {VueConstructor} from "vue";
import Router from "vue-router";
import PresetList from "@/options/components/PresetList.vue";
import PresetEdit from "@/options/components/PresetEdit.vue";
import SettingList from "@/options/components/SettingList.vue";
Vue.use(Router);

//TODO: 2020-01-15 まだ vu-composition-api が router に対する型エラーを解決できていないようなのでキャストで凌ぐ
//https://github.com/vuejs/vue-router/issues/3019#issuecomment-570764342
export default new Router({
  routes: [
    {
      path: '/',
      name: 'PresetList',
      component: PresetList as VueConstructor<Vue>
    },
    {
      path: '/edit/:index',
      name: 'PresetEdit',
      component: PresetEdit as VueConstructor<Vue>
    },
    {
      path: '/setting',
      name: 'SettingList',
      component: SettingList as VueConstructor<Vue>
    },
  ]
});
