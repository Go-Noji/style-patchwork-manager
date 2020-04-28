<template>
  <div
    class="background"
    :style="'background-color: '+color"
  >
    <div
      :style="'background:linear-gradient('+Math.floor(Math.random() * 360)+'deg, '+getKindColorCode(color, Math.floor(Math.random() * 60), 70, 0)+' 10%, '+getKindColorCode(color, 180, 0 , 0)+')'"
      class="backgroundFront"
    ></div>
    <div
      :style="'background: linear-gradient('+Math.floor(Math.random() * 360)+'deg, '+getKindColorCode(color, Math.floor(Math.random() * 60), -40, -70)+' 70%, '+getKindColorCode(color, 180, 0 , 0)+')'"
      class="backgroundFront"
    ></div>
    <div
      class="backgroundBack"
      :style="'background-color: '+color"
    ></div>
  </div>
</template>

<script lang="ts">
  import {computed, createComponent, inject, onMounted, SetupContext} from "@vue/composition-api";
  import {USE_PRESET_KEY} from "@/options/compositions/presetComposition";
  import {isColorKeys} from "@/settings/interface";
  import {COLORS} from "@/settings/settings";

  /**
   * rgb 形式のカラーコードを hsl 形式に変換して返す
   * @param red
   * @param green
   * @param blue
   */
  const getHSL = (red: number, green: number, blue: number): {hue: number, saturation: number, lightness: number} => {
    //三食のうち一つでも 0 ~ 255 の範囲から外れていたら 0 0 0 を返す
    if ([red, green, blue].some(value => value > 255 || 0 > value)) {
      return {hue: 0, saturation: 0, lightness: 0};
    }

    //各色の最大値と最小値を求める
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    //輝度を求める
    const lightness = Math.round((max + min) / 2 / 255 * 100);

    //彩度を求める
    const saturation = (max + min) / 2 > 217
      ? Math.floor((max - min) / (510 - max - min) * 100)
      : Math.floor((max - min) / (max + min) * 100);

    //色相を求める
    //無彩色
    let hue = 0;

    //赤系
    if (red > green && red > blue) {
      hue = 60 * ((green - blue) / (max - min));
    }

    //緑系
    else if (green > red && green > blue) {
      hue = 60 * ((blue - red) / (max - min)) + 120;
    }

    //青系
    else if (blue > red && blue > green) {
      hue = 60 * ((red - green) / (max - min)) + 240;
    }

    //返す
    return {hue, saturation, lightness};
  };

  /**
   * hsl 形式のカラーコードを rba 形式に変換して返す
   * @param hue
   * @param saturation
   * @param lightness
   */
  const getRGB = (hue: number, saturation: number, lightness: number): {red: number, green: number, blue: number} => {
    //彩度 or 輝度 が 0 ~ 100 の範囲外だったら 0 0 0 を返す
    if (saturation < 0 || 100 < saturation || lightness < 0 || 100 < lightness) {
      return {red: 0, green: 0, blue: 0};
    }

    //hue の範囲を 0 ~ 359 へ補正する
    hue = Math.round(hue - (Math.floor(hue / 360) * 360));

    //rgb の最大値・最小値を求める
    const max = lightness < 50
      ? Math.round(2.55 * (lightness + lightness * (saturation / 100)))
      : Math.round(2.55 * (lightness + (100 - lightness) * (saturation / 100)));
    const min = lightness < 50
      ? Math.round(2.55 * (lightness - lightness * (saturation / 100)))
      : Math.round(2.55 * (lightness - (100 - lightness) * (saturation / 100)));

    //60 刻みで赤緑青の計算方法を分ける
    if (0 <= hue && hue <= 60) {
      return {red: max, green: Math.round((hue / 60) * (max - min) + min), blue: min};
    }
    else if (61 <= hue && hue <= 120) {
      return {red: Math.round(((120 - hue) / 60) * (max - min) + min), green: max, blue: min};
    }
    else if (121 <= hue && hue <= 180) {
      return {red: min, green: max, blue: Math.round(((hue - 120) / 60) * (max - min) + min)};
    }
    else if (181 <= hue && hue <= 240) {
      return {red: min, green: Math.round(((240 - hue) / 60) * (max - min) + min), blue: max};
    }
    else if (241 <= hue && hue <= 300) {
      return {red: Math.round(((hue - 240) / 60) * (max - min) + min), green: min, blue: max};
    }
    return {red: max, green: min, blue: Math.round(((360 - hue) / 60) * (max - min) + min)};
  };

  export default createComponent({
    setup(_, context: SetupContext) {
      //プリセット用の composition function を用意
      const store = inject(USE_PRESET_KEY);

      //composition function の絞り込み
      if (store === undefined) {
        return;
      }

      //現在表示すべき色を返す
      const color = computed<string>(() => {
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
          return '#9E9E9E';
        }

        //プリセットに設定されている色を返す
        return String(COLORS[color]);
      });

      //16 進数カラーコードを受け取り、hls で h に +120, s に -30, l に +30 した色を 16 進数カラーコードで返す
      const getKindColorCode = (code: string, hue: number, saturation: number, lightness: number): string => {
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

        //カラーコードを HSL 形式に変換したものを用意
        const hsl = getHSL(parseInt(code.substr(0, 2), 16), parseInt(code.substr(2, 2), 16), parseInt(code.substr(4, 2), 16));

        //ずらした色を返す
        const rgb = getRGB(
          hsl.hue + hue,
          saturation < 0 ? Math.max(hsl.saturation + saturation, 0) : Math.min(hsl.saturation + saturation, 100),
          lightness < 0 ? Math.max(hsl.lightness + lightness, 0) : Math.min(hsl.lightness + lightness, 100)
        );

        //合成して返す
        return '#'+rgb.red.toString(16).padStart(2, '0')+rgb.green.toString(16).padStart(2, '0')+rgb.blue.toString(16).padStart(2, '0');
      };

      //データを読み込む
      onMounted(() => {
        store.readPresets();
      });

      //データの伝播
      return {color, getKindColorCode};
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
    transition: background-color .2s ease-out;
  }
  .backgroundBack{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    transition: background-color .2s ease-out;
    opacity: .5;
    mix-blend-mode: overlay;
  }
  .backgroundFront{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    transition: background-color .2s ease-out;
    opacity: .5;
    mix-blend-mode: difference;
  }
</style>
