<template>
  <button
    :style="style"
    class="appButton"
    @click="clickButton"
    @mouseenter="invertedColor"
    @mouseleave="undoColor"
  ><slot></slot></button>
</template>

<script lang="ts">
  import {ref, computed, createComponent, SetupContext} from "@vue/composition-api";

  type Props = {
    keyColor: string,
    baseColor: string
  };

  export default createComponent({
    props: {
      keyColor: {
        type: String,
        required: true
      },
      baseColor: {
        type: String,
        required: true
      }
    },
    setup(props: Props, context: SetupContext) {
      //カラーを反転させるフラグ
      const invertedColorFlg = ref(false);

      //style 属性に設定する文字列を算出する
      const style = computed(() => invertedColorFlg.value
        ? 'color:'+props.baseColor+';background-color:'+props.keyColor+';border-color:'+props.keyColor+';'
        : 'color:'+props.baseColor+';background-color:transparent;border-color:'+props.keyColor+';');

      /**
       * クリックを親へ伝播する
       */
      const clickButton = () => {
        context.emit('click-button');
      };

      /**
       * 色を反転する
       */
      const invertedColor = () => {
        invertedColorFlg.value = true;
      };

      /**
       * 色を元に戻す
       */
      const undoColor = () => {
        invertedColorFlg.value = false;
      };

      //伝播
      return {clickButton, style, invertedColor, undoColor};
    }
  })
</script>

<style lang="scss" scoped>
  .appButton{
    appearance: none;
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
    background-color: transparent;
    cursor: pointer;
    padding: 10px 20px;
    font-size: 14px;
    line-height: 1;
    transition: color, background-color .2s ease-out;
  }
</style>
