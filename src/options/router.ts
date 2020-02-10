import Vue, {VueConstructor} from "vue";
import Router from "vue-router";
import PresetList from "@/options/components/PresetList.vue";
import PresetEdit from "@/options/components/PresetEdit.vue";
import SettingList from "@/options/components/SettingList.vue";
import HeaderPresetList from "@/options/components/HeaderPresetList.vue";
import HeaderPresetEdit from "@/options/components/HeaderPresetEdit.vue";
import HeaderPresetSetting from "@/options/components/HeaderPresetSetting.vue";
Vue.use(Router);

//TODO: 2020-01-15 まだ vu-composition-api が router に対する型エラーを解決できていないようなのでキャストで凌ぐ
//https://github.com/vuejs/vue-router/issues/3019#issuecomment-570764342
export default new Router({
  routes: [
    {
      path: '/',
      name: 'PresetList',
      components: {
        default: PresetList as VueConstructor<Vue>,
        header: HeaderPresetList as VueConstructor<Vue>
      }
    },
    {
      path: '/edit/:index',
      name: 'PresetEdit',
      components: {
        default: PresetEdit as VueConstructor<Vue>,
        header: HeaderPresetEdit as VueConstructor<Vue>
      }
    },
    {
      path: '/setting',
      name: 'SettingList',
      components: {
        default: SettingList as VueConstructor<Vue>,
        header: HeaderPresetSetting as VueConstructor<Vue>
      }
    },
  ]
});
