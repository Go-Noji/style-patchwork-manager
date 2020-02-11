<template>
  <div class="headerContainer">
    <nav class="headerSection">
      <AppHeaderLink to=""><AppLocalizationText msg="msg_preset_list"></AppLocalizationText></AppHeaderLink>
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
