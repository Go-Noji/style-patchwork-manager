<template>
  <div class="headerContainer">
    <nav class="headerSection">
      <AppHeaderLink
        to="/"
        color="#9E9E9E"
      ><AppLocalizationText msg="msg_preset_list"></AppLocalizationText></AppHeaderLink>
      <p class="headerSeparator"><img
        svg-inline
        class="arrowIcon"
        src="@/assets/arrow.svg"
        alt="setting"
      ></p>
      <AppHeaderLink
        v-if="preset === null"
        to=""
        color="#9E9E9E"
      ><AppLocalizationText msg="msg_loading"></AppLocalizationText></AppHeaderLink>
      <AppHeaderLink
        v-else
        to=""
        :color="getColorCode(preset.color)"
      >{{preset.title}}</AppHeaderLink>
    </nav>
    <nav class="headerSection">
      <AppHeaderLink
        to="/setting"
        color="#9E9E9E"
      ><img
        svg-inline
        class="headerSettingIcon"
        src="@/assets/setting.svg"
        alt="setting"
      ></AppHeaderLink>
    </nav>
  </div>
</template>

<script lang="ts">
  import {computed, createComponent, onMounted, SetupContext} from "@vue/composition-api";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppHeaderLink from "@/options/components/AppHeaderLink.vue";
  import usePresets from "@/options/compositions/presetComposition";
  import {isColorKeys} from "@/settings/interface";
  import {COLORS} from "@/settings/settings";

  export default createComponent({
    components: {
      AppLocalizationText,
      AppHeaderLink
    },
    setup(_, context: SetupContext) {
      //プリセットの対象インデックス
      const index = Number(context.root.$route.params['index']);

      //プリセット用の composition function を用意
      const {state, readPresets} = usePresets();

      //プリセットデータ
      const preset = computed(() => state.presets[index] === undefined ? null : state.presets[index]);

      /**
       * COLORS のキー名から実際のカラーコードを取得する
       */
      const getColorCode = (value: string) => {
        return isColorKeys(value) ? COLORS[value] : '#9E9E9E';
      };

      //データを読み込む
      onMounted(() => {
        readPresets();
      });

      //データの伝播
      return {preset, getColorCode};
    }
  });
</script>

<style scoped lang="scss">
  .arrowIcon{
    width: 20px;
  }
</style>
