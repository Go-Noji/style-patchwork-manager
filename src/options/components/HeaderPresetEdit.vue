<template>
  <div class="inner headerContainer">
    <nav class="headerSection">
      <router-link
        class="headerTitle"
        to="/"
      ><AppLocalizationText msg="msg_preset_list"></AppLocalizationText></router-link>
      <p class="headerSeparator">&nbsp;&gt;&nbsp;</p>
      <h1
        class="headerTitle"
        v-if="preset === null"
      ><AppLocalizationText msg="msg_loading"></AppLocalizationText></h1>
      <h1
        v-else
        class="headerTitle"
      >{{preset.title}}</h1>
    </nav>
    <nav class="headerSection">
      <router-link
        class="headerTitle"
        to="/setting"
      ><AppLocalizationText msg="msg_setting"></AppLocalizationText></router-link>
    </nav>
  </div>
</template>

<script lang="ts">
  import {computed, createComponent, onMounted, SetupContext} from "@vue/composition-api";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import usePresets from "@/options/compositions/presetComposition";

  export default createComponent({
    components: {
      AppLocalizationText
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

</style>
