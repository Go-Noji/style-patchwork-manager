<template>
  <article>
    <h1>プリセットの編集</h1>
    <p>{{error}}</p>
    <div
      v-if="preset !== null"
    >
      <section>
        <label>
          <h3>プリセット名</h3>
          <input
            v-model="preset.title"
            type="text"
          >
        </label>
      </section>
      <section>
        <label>
          <h3>対象URL(省略すると全サイトへ適用されます)</h3>
          <input
            v-model="preset.url"
            typeof="text"
          >
        </label>
      </section>
      <section>
        <label>
          <h3>管理色</h3>
          <select
            v-model="preset.color"
          >
            <option
              v-for="(color, name) in colors"
              :key="name"
              :value="name"
              :style="'color: '+color"
            >{{name}}({{color}})</option>
          </select>
        </label>
      </section>
      <section>
        <h3>スタイル定義</h3>
        <ul>
          <li
            v-for="(define, defineIndex) in preset.defines"
            :key="'define_'+defineIndex"
          >
            <PresetEditDefine
              :index="defineIndex"
              :define="define"
              @change-define="changeDefine"
              @delete-define="deleteDefine"
              @create-define-coordinate="createDefineCoordinate"
              @create-define-style="createDefineStyle"
            ></PresetEditDefine>
          </li>
        </ul>
        <button
          type="button"
          @click="createDefine"
        >追加する</button>
      </section>
      <section>
        <label>
          <h3>自由記述スタイルシート</h3>
          <textarea
            v-model="preset.style"
          ></textarea>
        </label>
      </section>
    </div>
    <div
      v-else
    >
      <p>プリセット読み込み中...</p>
    </div>
    <p><router-link to="/">戻る</router-link></p>
  </article>
</template>

<script lang="ts">
  import {createComponent, reactive, SetupContext, onMounted, ref, computed} from "@vue/composition-api";
  import {COLORS, DEFAULT_DEFINE, DEFAULT_DEFINE_COORDINATE, DEFAULT_DEFINE_STYLE} from "@/settings/settings";
  import usePresets from "@/options/presetComposition";
  import {Define, Preset} from "@/settings/interface";
  import PresetEditDefine from "@/options/PresetEditDefine";

  export default createComponent({
    components: {
      PresetEditDefine
    },
    setup(props, context: SetupContext) {
      //プリセットの対象インデックス
      const index = Number(context.root.$route.params['index']);

      //プリセット用の composition function を用意
      const {state, readPresets, updatePreset} = usePresets();

      //プリセットデータ
      const preset = computed(() => state.presets[index] === undefined ? null : state.presets[index]);

      //Define を追加する
      const createDefine = async () => {
        //定義を追加した形のデータを用意
        const data = {...state.presets[index]};
        data.defines.push(DEFAULT_DEFINE);

        //更新
        await updatePreset(index, data);
      };

      //Define を変更する
      const changeDefine = async ({defineIndex, define}: {defineIndex: number, define: Define}) => {
        //対象プリセットの用意
        const data = {...state.presets[index]};

        //対象が無ければなにもしない
        if (data.defines[defineIndex] === undefined) {
          return;
        }

        //定義を追加
        data.defines.splice(defineIndex, 1, define);

        //更新
        await updatePreset(index, data);
      };

      //Define を削除する
      const deleteDefine = async (defineIndex: number) => {
        //対象プリセットの用意
        const data = {...state.presets[index]};

        //対象が無ければなにもしない
        if (data.defines[defineIndex] === undefined) {
          return;
        }

        //定義を削除
        data.defines.splice(defineIndex, 1);

        //更新
        await updatePreset(index, data);
      };

      //適用条件の追加
      const createDefineCoordinate = async (defineIndex: number) => {
        //対象プリセットの用意
        const data = {...state.presets[index]};

        //対象が無ければなにもしない
        if (data.defines[defineIndex] === undefined) {
          return;
        }

        //適用条件を追加
        data.defines[defineIndex].coordinates.push(DEFAULT_DEFINE_COORDINATE);

        //更新
        await updatePreset(index, data);
      };

      //適用スタイルの追加
      const createDefineStyle = async (defineIndex: number) => {
        //対象プリセットの用意
        const data = {...state.presets[index]};

        //対象が無ければなにもしない
        if (data.defines[defineIndex] === undefined) {
          return;
        }

        //適用条件を追加
        data.defines[defineIndex].styles.push(DEFAULT_DEFINE_STYLE);

        //更新
        await updatePreset(index, data);
      };

      //データを読み込む
      onMounted(() => {
        readPresets();
      });

      //テンプレートへ伝播
      return {
        error: state.error,
        colors: COLORS,
        preset,
        changeDefine,
        createDefine,
        deleteDefine,
        createDefineCoordinate,
        createDefineStyle
      };
    }
  })
</script>

<style scoped>

</style>
