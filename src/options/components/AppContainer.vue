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
  import {createComponent} from "@vue/composition-api";
  import PresetList from "@/options/components/PresetList";
  import TheHeader from "@/options/components/TheHeader";

  export default createComponent({
    components: {
      PresetList,
      TheHeader
    }
  })
</script>

<style scoped lang="scss">
  .wrapper{
    max-width: 960px;
    margin: 60px auto;
  }
</style>
