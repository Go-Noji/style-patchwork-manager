<template>
  <div class="headerLinkWrapper inner">
    <router-link
      v-if="to !== ''"
      class="headerTitle"
      :to="to"
    ><slot></slot></router-link>
    <h1
      v-else
      class="headerTitle"
    ><slot></slot></h1>
    <div class="headerLinkUnderBarWrapper">
      <span
        v-show="to === ''"
        class="headerLinkUnderBarCurrent"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
  import {createComponent} from "@vue/composition-api";

  export default createComponent({
    props: {
      to: {
        type: String,
        required: true
      }
    }
  });
</script>

<style scoped lang="scss">
  .headerLinkWrapper{
    position: relative;
    box-sizing: border-box;
  }
  .headerLinkUnderBarWrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
  }
  .headerLinkUnderBarCurrent{
    display: block;
    width: 100%;
    height: 4px;
    background-color: #9E9E9E;
  }
</style>
