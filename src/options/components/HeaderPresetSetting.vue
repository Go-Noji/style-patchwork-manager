<template>
  <div class="headerContainer">
    <div class="headerSection">
      <AppHeaderLink
        to="/"
        color="#9E9E9E"
      ><AppLocalizationText msg="msg_preset_list"></AppLocalizationText></AppHeaderLink>
    </div>
    <div class="headerSection">
      <AppHeaderLink
        to=""
        color="#9E9E9E"
      ><img
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
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppHeaderLink from "@/options/components/AppHeaderLink.vue";

  export default createComponent({
    components: {
      AppLocalizationText,
      AppHeaderLink
    }
  });
</script>

<style scoped lang="scss">

</style>
