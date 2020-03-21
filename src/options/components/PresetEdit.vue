<template>
  <article class="inner">
    <p>{{error}}</p>
    <div
      v-if="preset !== null"
    >
      <section class="formSection">
        <label>
          <h3 class="formHeader"><AppLocalizationText msg="msg_preset_name"></AppLocalizationText></h3>
          <input
            class="formInput"
            v-model="preset.title"
            type="text"
            @change="updatePresetData('title', $event)"
          >
        </label>
      </section>
      <section class="formSection">
        <label>
          <h3 class="formHeader"><AppLocalizationText msg="msg_preset_target_url"></AppLocalizationText></h3>
          <input
            class="formInput"
            v-model="preset.url"
            type="text"
            @change="updatePresetData('url', $event)"
          >
        </label>
      </section>
      <section class="formSection">
        <h3 class="formHeader"><AppLocalizationText msg="msg_preset_label_color"></AppLocalizationText></h3>
        <ul class="formColorBox">
          <li
            v-for="(color, name) in colors"
            :key="name"
            class="formColorList"
          >
            <label
              class="formColorLabel"
              :style="preset.color === name ? 'background-color: '+color : 'opacity: .5;background-color: '+color"
            >
              <input
                v-model="preset.color"
                :value="name"
                type="checkbox"
                class="formColorCheckbox"
                @change="updatePresetData('color', $event)"
              >
              <p class="formColorText">
                <span v-show="preset.color === name">
                  <img
                    svg-inline
                    class="formColorCheckIcon"
                    src="@/assets/check.svg"
                    alt="checked"
                  >
                </span>
                <span>{{name}}</span>
              </p>
            </label>
          </li>
        </ul>
      </section>
      <section class="formSection">
        <h3 class="formHeader"><AppLocalizationText msg="msg_preset_style_definition"></AppLocalizationText></h3>
        <ul class="editBox">
          <li
            v-for="(define, defineIndex) in preset.defines"
            :key="'define_'+defineIndex"
            class="editList"
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
        <div class="editButtonWrapper">
          <AppButton
            keyColor="#000"
            baseColor="#FAFAFA"
            @click-button="createDefine"
          ><AppLocalizationText msg="msg_definition"></AppLocalizationText>&nbsp;<AppLocalizationText msg="msg_add"></AppLocalizationText></AppButton>
        </div>
      </section>
      <section class="formSection">
        <label>
          <h3 class="formHeader"><AppLocalizationText msg="msg_preset_free_stylesheet"></AppLocalizationText></h3>
          <textarea
            class="formInput"
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
    <AppModal
      v-show="deleteModalFlag"
      @click-outer="deleteModalFlag = false"
    >
      <AppModalDeleteWindow
        @click-delete="deleteDefine"
        @click-back="deleteModalFlag = false"
      >
        <p><AppLocalizationText msg="msg_delete_attention"></AppLocalizationText></p>
      </AppModalDeleteWindow>
    </AppModal>
  </article>
</template>

<script lang="ts">
  import {createComponent, SetupContext, onMounted, computed, inject, ref} from "@vue/composition-api";
  import {COLORS, DEFAULT_DEFINE, DEFAULT_DEFINE_COORDINATE, DEFAULT_DEFINE_STYLE} from "@/settings/settings";
  import {USE_PRESET_KEY} from "@/options/compositions/presetComposition";
  import {Define} from "@/settings/interface";
  import PresetEditDefine from "@/options/components/PresetEditDefine.vue";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppButton from "@/options/components/AppButton.vue";
  import AppModal from "@/options/components/AppModal.vue";
  import AppModalDeleteWindow from "@/options/components/AppModalDeleteWindow.vue";
  import {USE_SETTING} from "@/options/compositions/settingComposition";

  export default createComponent({
    components: {
      PresetEditDefine,
      AppLocalizationText,
      AppButton,
      AppModal,
      AppModalDeleteWindow
    },
    setup(_, context: SetupContext) {
      //プリセットの対象インデックス
      const index = Number(context.root.$route.params['index']);

      //プリセット用の composition function を用意
      const store = inject(USE_PRESET_KEY);

      //composition function の絞り込み
      if (store === undefined) {
        return;
      }

      //設定用の composition function を用意
      const setting = inject(USE_SETTING);

      //composition function の絞り込み
      if (setting === undefined) {
        return;
      }

      //削除モーダルの表示フラグ
      const deleteModalFlag = ref(false);

      //削除モーダルの実行ボタンを押した際に削除されるインデックス
      let deleteIndex = -1;

      //プリセットデータ
      const preset = computed(() => store.state.presets[index] === undefined ? null : store.state.presets[index]);

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
        await store.updatePreset(index, {...store.state.presets[index], [key]: event.target.value});
      };

      /**
       * Define を追加する
       */
      const createDefine = async () => {
        //定義を追加した形のデータを用意
        const data = {...store.state.presets[index]};
        data.defines.push(DEFAULT_DEFINE);

        //更新
        await store.updatePreset(index, data);
      };

      /**
       * Define を変更する
       * @param defineIndex
       * @param define
       */
      const changeDefine = async ({defineIndex, define}: {defineIndex: number, define: Define}) => {
        //対象プリセットの用意
        const data = {...store.state.presets[index]};

        //定義を追加
        data.defines.splice(defineIndex, 1, define);

        //更新
        await store.updatePreset(index, data);
      };

      /**
       * Define を削除する
       * @param defineIndex
       */
      const deleteDefine = async (defineIndex: number = -1) => {
        //defineIndex が -1 (=引数が省略されている) 場合はモーダルのボタンによる実行と判定し、deleteIndex を設定する
        defineIndex = defineIndex === -1 ? deleteIndex : defineIndex;

        //モーダルが表示されておらず、かつ確認フラグが true ならモーダルを表示 & インデックスを保持
        if ( ! deleteModalFlag.value && setting.state.deleteConfirm) {
          deleteIndex = defineIndex;
          deleteModalFlag.value = true;
          return;
        }

        //対象プリセットの用意
        const data = {...store.state.presets[index]};

        //定義を削除
        data.defines.splice(defineIndex, 1);

        //更新
        await store.updatePreset(index, data);

        //モーダルが表示されていれば消す
        deleteModalFlag.value = false;
      };

      /**
       * 適用条件の追加
       * @param defineIndex
       */
      const createDefineCoordinate = async (defineIndex: number) => {
        //対象プリセットの用意
        const data = {...store.state.presets[index]};

        //適用条件を追加
        data.defines[defineIndex].coordinates.push(DEFAULT_DEFINE_COORDINATE);

        //更新
        await store.updatePreset(index, data);
      };

      /**
       * 適用スタイルの追加
       * @param defineIndex
       */
      const createDefineStyle = async (defineIndex: number) => {
        //対象プリセットの用意
        const data = {...store.state.presets[index]};

        //適用条件を追加
        data.defines[defineIndex].styles.push(DEFAULT_DEFINE_STYLE);

        //更新
        await store.updatePreset(index, data);
      };

      //データを読み込む
      onMounted(() => {
        store.readPresets();
      });

      //テンプレートへ伝播
      return {
        error: store.state.error,
        colors: COLORS,
        preset,
        deleteModalFlag,
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
  .formHeader{
    font-size: 18px;
    margin: 0 0 10px 0;
  }
  .formSection{
    margin-top: 40px;
  }
  .formSection:first-child{
    margin-top: 0;
  }
  .formColorBox{
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
  .formColorList{
    list-style-type: none;
    margin: 10px;
    font-size: 16px;
    font-weight: 700;
  }
  .formColorLabel{
    display: block;
    padding: 10px;
    min-width: 50px;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
  }
  .formColorCheckbox{
    display: none;
  }
  .formColorText{
    color: #fff;
    margin: 0;
  }
  .formColorCheckIcon{
    display: inline;
    width: 25px;
    padding: 0 5px;
  }
  .editBox{
    margin: 0;
    padding: 0;
  }
  .editList{
    list-style-type: none;
  }
  .editButtonWrapper{
    display: flex;
    justify-content: flex-end;
  }
</style>
