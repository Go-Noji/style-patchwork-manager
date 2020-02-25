<template>
  <div class="wrapper">
    <div class="container">
      <TheHeader></TheHeader>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
  import {createComponent, provide} from "@vue/composition-api";
  import PresetList from "@/options/components/PresetList.vue";
  import TheHeader from "@/options/components/TheHeader.vue";
  import presetComposition, {USE_PRESET_KEY} from "@/options/compositions/presetComposition";
  import settingComposition, {USE_SETTING} from "@/options/compositions/settingComposition";

  export default createComponent({
    components: {
      PresetList,
      TheHeader
    },
    setup() {
      provide(USE_PRESET_KEY, presetComposition());
      provide(USE_SETTING, settingComposition());
    }
  })
</script>

<style scoped lang="scss">
  .wrapper{
    max-width: 960px;
    margin: 60px auto;
  }
</style>
