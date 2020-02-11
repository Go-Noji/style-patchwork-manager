<template>
  <div class="headerContainer">
    <nav class="headerSection">
      <AppHeaderLink to="/"><AppLocalizationText msg="msg_preset_list"></AppLocalizationText></AppHeaderLink>
      <p class="headerSeparator"><img
        svg-inline
        class="arrowIcon"
        src="@/assets/arrow.svg"
        alt="setting"
      ></p>
      <AppHeaderLink
        v-if="preset === null"
        to=""
      ><AppLocalizationText msg="msg_loading"></AppLocalizationText></AppHeaderLink>
      <AppHeaderLink
        v-else
        to=""
      >{{preset.title}}</AppHeaderLink>
    </nav>
    <nav class="headerSection">
      <AppHeaderLink to="/setting"><img
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
  import AppLocalizationText from "@/options/components/AppLocalizationText";
  import AppHeaderLink from "@/options/components/AppHeaderLink";
  import usePresets from "@/options/compositions/presetComposition";

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

      //データを読み込む
      onMounted(() => {
        readPresets();
      });

      //データの伝播
      return {preset};
    }
  });
</script>

<style scoped lang="scss">
  .arrowIcon{
    width: 20px;
  }
</style>
