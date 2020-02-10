<template>
  <router-view></router-view>
</template>

<script lang="ts">
  import {createComponent} from "@vue/composition-api";
  import PresetList from "@/options/components/PresetList";

  export default createComponent({
    components: {
      PresetList
    }
  })
</script>

<style scoped>

</style>
