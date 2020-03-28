<template>
  <label
    :style="style"
    class="appFileInputLabel"
    @mouseenter="invertedColor"
    @mouseleave="undoColor"
  >
    <input
      class="appFileInput"
      type="file"
      @change="changeFile"
    >
    <slot></slot>
  </label>
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
      const changeFile = (event: Event) => {
        //情報の提供元が input でなければ何もしない
        if ( ! (event.target instanceof HTMLInputElement) || event.target.files === null || event.target.files.length < 1) {
          return;
        }

        //親へファイル情報ごと伝播
        context.emit('change-file', event.target.files[0]);
      };

      //伝播
      return {changeFile, style, invertedColor, undoColor};
    }
  })
</script>

<style lang="scss" scoped>
  .appFileInputLabel{
    display: block;
    max-width: 128px;
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
  .appFileInput{
    display: none;
  }
</style>
