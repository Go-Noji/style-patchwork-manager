<template>
  <router-view></router-view>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";
  import PresetList from "@/options/PresetList";

  export default createComponent({
    components: {
      PresetList
    },
    setup(props, context: SetupContext) {
    }
  })
</script>

<style scoped>

</style>
