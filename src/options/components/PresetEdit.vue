<template>
  <article class="inner">
    <p>{{error}}</p>
    <div
      v-if="preset !== null"
    >
      <section>
        <label>
          <h3><AppLocalizationText msg="msg_preset_name"></AppLocalizationText></h3>
          <input
            v-model="preset.title"
            type="text"
            @change="updatePresetData('title', $event)"
          >
        </label>
      </section>
      <section>
        <label>
          <h3><AppLocalizationText msg="msg_preset_target_url"></AppLocalizationText></h3>
          <input
            v-model="preset.url"
            typeof="text"
            @change="updatePresetData('url', $event)"
          >
        </label>
      </section>
      <section>
        <label>
          <h3><AppLocalizationText msg="msg_preset_label_color"></AppLocalizationText></h3>
          <select
            v-model="preset.color"
            :style="'color: '+preset.color"
            @input="updatePresetData('color', $event)"
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
        <h3><AppLocalizationText msg="msg_preset_style_definition"></AppLocalizationText></h3>
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
        ><AppLocalizationText msg="msg_add"></AppLocalizationText></button>
      </section>
      <section>
        <label>
          <h3><AppLocalizationText msg="msg_preset_free_stylesheet"></AppLocalizationText></h3>
          <textarea
            v-model="preset.style"
            @change="updatePresetData('style', $event)"
          ></textarea>
        </label>
      </section>
    </div>
    <div
      v-else
    >
      <p><AppLocalizationText msg="msg_loading"></AppLocalizationText></p>
    </div>
    <p><router-link to="/"><AppLocalizationText msg="msg_back"></AppLocalizationText></router-link></p>
  </article>
</template>

<script lang="ts">
  import {createComponent, SetupContext, onMounted, computed} from "@vue/composition-api";
  import {COLORS, DEFAULT_DEFINE, DEFAULT_DEFINE_COORDINATE, DEFAULT_DEFINE_STYLE} from "@/settings/settings";
  import usePresets from "@/options/compositions/presetComposition";
  import {Define} from "@/settings/interface";
  import PresetEditDefine from "@/options/components/PresetEditDefine";
  import AppLocalizationText from "@/options/components/AppLocalizationText";

  export default createComponent({
    components: {
      PresetEditDefine,
      AppLocalizationText
    },
    setup(_, context: SetupContext) {
      //プリセットの対象インデックス
      const index = Number(context.root.$route.params['index']);

      //プリセット用の composition function を用意
      const {state, readPresets, updatePreset} = usePresets();

      //プリセットデータ
      const preset = computed(() => state.presets[index] === undefined ? null : state.presets[index]);

      /**
       * preset の define 以外を更新する
       * @param key
       * @param event
       */
      const updatePresetData = async (key: string, event: Event) => {
        //event が input, select, もしくは textarea のイベントでなかったなにもしない
        if ( ! (event.target instanceof HTMLInputElement) && ! (event.target instanceof HTMLTextAreaElement) && ! (event.target instanceof HTMLSelectElement)) {
          return;
        }

        //プリセットデータの対象キーを変更したデータで更新
        await updatePreset(index, {...state.presets[index], [key]: event.target.value});
      };

      /**
       * Define を追加する
       */
      const createDefine = async () => {
        //定義を追加した形のデータを用意
        const data = {...state.presets[index]};
        data.defines.push(DEFAULT_DEFINE);

        //更新
        await updatePreset(index, data);
      };

      /**
       * Define を変更する
       * @param defineIndex
       * @param define
       */
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

      /**
       * Define を削除する
       * @param defineIndex
       */
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

      /**
       * 適用条件の追加
       * @param defineIndex
       */
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

      /**
       * 適用スタイルの追加
       * @param defineIndex
       */
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
        updatePresetData,
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
