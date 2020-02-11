<template>
  <div class="headerContainer">
    <div class="headerSection">
      <AppHeaderLink to="/"><AppLocalizationText msg="msg_preset_list"></AppLocalizationText></AppHeaderLink>
    </div>
    <div class="headerSection">
      <AppHeaderLink to=""><img
        svg-inline
        class="headerSettingIcon"
        src="@/assets/setting.svg"
        alt="setting"
      ></AppHeaderLink>
    </div>
  </div>
</template>

<script lang="ts">
  import {createComponent} from "@vue/composition-api";
  import AppLocalizationText from "@/options/components/AppLocalizationText";
  import AppHeaderLink from "@/options/components/AppHeaderLink";

  export default createComponent({
    components: {
      AppLocalizationText,
      AppHeaderLink
    }
  });
</script>

<style scoped lang="scss">

</style>
