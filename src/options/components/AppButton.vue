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
  import {createComponent, SetupContext} from "@vue/composition-api";
  import useButton from "@/options/compositions/buttonComposition";

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
      //ボタンのための共通関数をインポート
      const {style, colorSetting, invertedColor, undoColor} = useButton();

      //色を Props から useButton へと設定
      colorSetting(props.baseColor, props.keyColor);

      /**
       * クリックを親へ伝播する
       */
      const clickButton = () => {
        context.emit('click-button');
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
