<template>
  <div class="background">
    <div
      class="backgroundBack"
      :style="'background-color: '+colorCode"
    ></div>
    <div
      class="backgroundFront"
      :style="'background: linear-gradient('+deg+', #000 10%, transparent)'"
    ></div>
  </div>
</template>

<script lang="ts">
  import {computed, createComponent, inject, onMounted, SetupContext} from "@vue/composition-api";
  import {USE_PRESET_KEY} from "@/options/compositions/presetComposition";
  import {isColorKeys} from "@/settings/interface";
  import {COLORS} from "@/settings/settings";

  export default createComponent({
    setup(_, context: SetupContext) {
      //プリセット用の composition function を用意
      const store = inject(USE_PRESET_KEY);

      //composition function の絞り込み
      if (store === undefined) {
        return;
      }

      //現在表示すべき色を返す
      const colorCode = computed(() => {
        //設定画面は特別な背景色を返す
        if (context.root.$route.path.match(/^.*\/setting$/)) {
          return '#263238';
        }

        //プリセットの対象インデックス
        const index = Number(context.root.$route.params['index'] === undefined ? -1 : context.root.$route.params['index']);

        //プリセットが見つからなかったらデフォルト色を返す
        if (index === -1 || store.state.presets[index] === undefined) {
         return '#9E9E9E';
        }

        //現在のプリセットが示す色名を取得
        const color = store.state.presets[index].color;

        //色名が以上ならデフォルト色を返す
        if ( ! isColorKeys(color) || typeof color !== 'string') {
          return '#9E9E9E'
        }

        //プリセットに設定されている色を返す
        return COLORS[color];
      });

      //角度をランダムに作成する
      const deg = computed(() => context.root.$route.params['index'] ? String(Math.random() * 361)+'deg' : String(Math.random() * 151)+'deg');

      //データを読み込む
      onMounted(() => {
        store.readPresets();
      });

      //データの伝播
      return {colorCode, deg};
    }
  });
</script>

<style scoped lang="scss">
  .background{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }
  .backgroundBack{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    transition: background-color .2s ease-out;
  }
  .backgroundFront{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    opacity: .5;
  }
</style>
