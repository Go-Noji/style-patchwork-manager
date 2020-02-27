<template>
  <div
    v-show="showFlag"
    class="modalWrapper"
  >
    <div
      :style="'width:'+windowWidth+'px;height:'+windowHeight+'px;'"
      class="modalCurtain"
      @click="clickOuter"
    ></div>
    <div
      :style="'max-height:'+maxHeightValue"
      class="modalArea"
    ><slot></slot></div>
  </div>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";

  type Props = {
    showFlag: boolean,
    maxHeight: number
  };

  export default createComponent({
    props: {
      showFlag: {
        type: Boolean,
        required: true
      },
      maxHeight: {
        type: Number,
        required: false,
        default: 0
      }
    },
    setup(props: Props, context: SetupContext) {
      //高さ制限が 0 だったら無制限とする
      const maxHeightValue = props.maxHeight === 0 ? 'auto' : String(props.maxHeight)+'px';

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      /**
       * モーダル以外の部分がクリックされたことを親コンポーネントへ通知する
       */
      const clickOuter = () => {
        context.emit('click-outer');
      };

      //伝播
      return {maxHeightValue, windowWidth, windowHeight, clickOuter};
    }
  });
</script>

<style scoped lang="scss">
  .modalWrapper{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
  }
  .modalCurtain{
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .75);
    z-index: 11;
    cursor: pointer;
  }
  .modalArea{
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 960px;
    background-color: #FAFAFA;
    box-shadow: 0 5px 10px 2px rgba(0, 0, 0, 0.5);
    z-index: 12;
  }
</style>
