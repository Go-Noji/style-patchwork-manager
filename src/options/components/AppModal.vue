<template>
  <div
    v-show="showFlag"
    :style="'height:'+windowHeight+'px;'"
    class="modalWrapper"
  >
    <div
      :style="'height:'+windowHeight+'px;'"
      class="modalCurtain"
      @click="clickOuter"
    ></div>
    <div class="modalArea"><slot></slot></div>
  </div>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";

  type Props = {
    showFlag: boolean
  };

  export default createComponent({
    props: {
      showFlag: {
        type: Boolean,
        required: true
      }
    },
    setup(props: Props, context: SetupContext) {
      const windowHeight = window.innerHeight;

      /**
       * モーダル以外の部分がクリックされたことを親コンポーネントへ通知する
       */
      const clickOuter = () => {
        context.emit('click-outer');
      };

      //伝播
      return {windowHeight, clickOuter};
    }
  });
</script>

<style scoped lang="scss">
  .modalWrapper{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .modalCurtain{
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 11;
    cursor: pointer;
    width: 100%;
  }
  .modalArea{
    position: relative;
    z-index: 12;
  }
</style>
