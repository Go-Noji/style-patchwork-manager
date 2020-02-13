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
        :class="{headerLinkUnderBarCurrent: current}"
        class="headerLinkUnderBar"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
  import {createComponent, ref, onMounted} from "@vue/composition-api";

  type Props = {
    to: string
  };

  export default createComponent({
    props: {
      to: {
        type: String,
        required: true
      }
    },
    setup(props: Props) {
      //現在表示中のリンクか判定
      const current = ref(false);

      //表示中のリンクかの判定は 0.1 秒待ってから行う
      onMounted(() => {
        setTimeout(() => {
          current.value = props.to === ''
        }, 100);
      });

      //伝播
      return {current};
    }
  });
</script>

<style scoped lang="scss">
  .headerLinkWrapper{
    position: relative;
    box-sizing: border-box;
  }
  .headerLinkUnderBarWrapper{
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
  }
  .headerLinkUnderBar{
    transition: width .2s ease-out;
    display: block;
    width: 0%;
    height: 4px;
    background-color: #9E9E9E;
  }
  .headerLinkUnderBarCurrent{
    width: 100%;
  }
</style>
