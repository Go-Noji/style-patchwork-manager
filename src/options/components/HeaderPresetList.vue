<template>
  <div class="inner headerContainer">
    <nav class="headerSection">
      <h1 class="headerTitle"><AppLocalizationText msg="msg_preset_list"></AppLocalizationText></h1>
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
