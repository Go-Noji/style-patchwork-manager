<template>
  <div class="background">
    <div
      class="backgroundBack"
      :style="'background-color: '+colorCode"
    ></div>
    <div
      class="backgroundFront"
      :style="'background: linear-gradient('+deg+', '+getKindColorCode(colorCode)+' 10%, transparent)'"
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

      //rga からカラーホイールの角度を算出する
      const getColorRadian = (red: number, green: number, blue: number): number => {
        //rga のいずれかに 0 未満 or 255 より大きい数が存在したら 0 を返す
        if ([red, green, blue].some(color => color < 0 || 255 < color)) {
          return 0;
        }

        //Object in Array に成型して降順ソート
        const sets = [{color: 'red', quantity: red}, {color: 'green', quantity: green}, {color: 'blue', quantity: blue}].sort((a, b) => b.quantity - a.quantity);

        //増加減角度の算出
        const radius = 60 * ((sets[0].quantity - (sets[1].quantity - sets[2].quantity)) / sets[0].quantity);

        //赤系
        if (sets[0].color === 'red') {
          //青より緑の割合が多い場合は 0 に加算、緑より青の割合が多い場合は 360 から減算
          return sets[1].color === 'green'
            ? 0 + radius
            : 360 - radius;
        }

        //緑系
        else if (sets[0].color === 'green') {
          //赤より青の割合が多い場合は 120 に加算、青より赤の割合が多い場合は 120 から減算
          return sets[1].color === 'blue'
            ? 120 + radius
            : 120 - radius;
        }

        //青系
        //緑より赤の割合が多い場合は 240 に加算、赤より緑の割合が多い場合は 240 から減算
        return sets[1].color === 'red'
          ? 240 + radius
          : 240 - radius;
      }

      //rga からカラーホイール中心からの距離を 0 ~ 1 の範囲で返す
      const getColorRadius = (red: number, green: number, blue: number): number => {
        //rga のいずれかに 0 未満 or 255 より大きい数が存在したら 0 を返す
        if ([red, green, blue].some(color => color < 0 || 255 < color)) {
          return 0;
        }

        //全てを足し、765 との差を割合として算出
        return (765 - (red + green + blue)) / 765;
      };

      //角度、中心からの距離、一番強い色の値から rgb を返す
      const getColor = (radian: number, radius: number, max: number): [number, number, number] => {
        //radian が 0 未満 or 360 以上 or max が 0 未満 1 以上だったら [0, 0, 0] を返す
        if (radian < 0 || 360 < radian || radius < 0 || 1 < radius) {
          return [0, 0, 0];
        }

        //300 <= radian and radian <= 359 or 0 <= radian and radian <= 60 は赤系
        if ((300 <= radian && radian <= 359) || (0 <= radian && radian <= 60)) {
          //300 <= radian and radian <= 359 なら青寄り、0 <= radian and radian <= 60　なら緑寄り
          return 300 <= radian && radian <= 359
            ? [max, max * radius, (max - (max * (360 - radian) / 60)) * radius]
            : [max, (max - (max * (radian === 0 ? 0 : 60 - radian) / 60)) * radius, max * radius];
        }

        //60 <= radian and radian <= 180 は緑系
        else if (60 <= radian && radian <= 180) {
          //120 <= radian なら青寄り、radian <= 120　なら赤寄り
          return 120 <= radian
            ? [max * radius, max, (max - (max * (180 - radian) / 60)) * radius]
            : [(max - (max * (120 - radian) / 60)) * radius, max, max * radius];
        }

        //180 <= radius and radius <= 300 は青系
        //240 <= radian なら赤寄り、radian <= 240　なら緑寄り
        return 120 <= radian
          ? [(max - (max * (240 - radian) / 60)) * radius, max * radius, max]
          : [max * radius, (max - (max * (240 - radian) / 60)) * radius, max];
      };

      //色相環で +45 度、外側に 0.3 離した色を算出する
      const getKindColorCode = (code: string): string => {
        //code から # を削除し、小文字化
        code = code.replace('#', '').toLowerCase();

        //code が 3 文字だったら省略形(fff 等)とみなし、各文字を二重にして 6 文字にする
        if (code.length === 3) {
          code =
            code.substr(0, 1)+code.substr(0, 1)
            +code.substr(1, 1)+code.substr(1, 1)
            +code.substr(2, 1)+code.substr(2, 1);
        }

        //code が 16 進数のカラーコードではなかった場合、#000 を返す
        if ( ! code.match(/^[a-f0-9]{6}$/)) {
          return '#000';
        }

        //各桁を RGB (0 ~ 255)に分ける
        const red = parseInt(code.substr(0, 2), 16);
        const green = parseInt(code.substr(2, 2), 16);
        const blue = parseInt(code.substr(4, 2), 16);

        //#ff0000 を 0 度としたときの角度、距離を求める
        let radian = getColorRadian(red, green, blue);
        let radius = getColorRadius(red, green, blue);

        //120 度 +、0.5 中心から離した色を算出
        radian = radian > 240
          ? radian + 120 - 360
          : radian + 120;
        radius = radius > 0.5
          ? 0
          : radius + 0.5;

        //ズラした色を算出
        const rgb = getColor(radian, radius, Math.max(red, green, blue));

        //合成して返す
        const r = Math.floor(rgb[0]).toString(16);
        const g = Math.floor(rgb[1]).toString(16);
        const b = Math.floor(rgb[2]).toString(16);
        return '#'+(r.length < 2 ? '0'+r : r)+(g.length < 2 ? '0'+g : g)+(b.length < 2 ? '0'+b : b);
      };

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
      return {colorCode, deg, getKindColorCode};
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
