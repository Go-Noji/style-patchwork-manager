import {computed, ref} from "@vue/composition-api";

export default () => {
  //カラーを反転させるフラグ
  const invertedColorFlg = ref(false);

  //style が吐き出すカラー
  let baseColorStyle = '#FAFAFA';
  let keyColorStyle = '#607D8B';

  //style 属性に設定する文字列を算出する
  const style = computed(() => invertedColorFlg.value
    ? 'color:'+baseColorStyle+';background-color:'+keyColorStyle+';border-color:'+keyColorStyle+';'
    : 'color:'+baseColorStyle+';background-color:transparent;border-color:'+keyColorStyle+';');

  /**
   * 色を設定する
   * @param baseColor
   * @param keyColor
   */
  const colorSetting = (baseColor: string, keyColor: string) => {
    baseColorStyle = baseColor;
    keyColorStyle = keyColor;
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

  //返す
  return {style, colorSetting, invertedColor, undoColor};
};
