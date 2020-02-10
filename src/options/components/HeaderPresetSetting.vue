<template>
  <div class="inner headerContainer">
    <div class="headerSection">
      <router-link
        class="headerTitle"
        to="/"
      ><AppLocalizationText msg="msg_preset_list"></AppLocalizationText></router-link>
    </div>
    <div class="headerSection">
      <h1 class="headerTitle"><AppLocalizationText msg="msg_setting"></AppLocalizationText></h1>
    </div>
  </div>
</template>

<script lang="ts">
  import {createComponent} from "@vue/composition-api";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";

  export default createComponent({
    components: {
      AppLocalizationText
    }
  });
</script>

<style scoped lang="scss">

</style>
