<template>
  <article class="inner">
    <div v-if="state.init">
      <ul class="presetBox">
        <li
          v-for="(preset, index) in state.presets"
          class="presetList"
        >
          <PresetListItem
            :index="index"
            :title="preset.title"
            :url="preset.url"
            :color="preset.color"
            @delete-preset="_delete"
          ></PresetListItem>
        </li>
        <li class="presetList presetListCreate">
          <button
            @click="_create"
            class="presetCreateButton"
          ><AppLocalizationText msg="msg_add"></AppLocalizationText></button>
        </li>
      </ul>
    </div>
    <div
      v-else
    >
      <p><AppLocalizationText msg="msg_loading"></AppLocalizationText></p>
    </div>
  </article>
</template>

<script lang="ts">
  import {createComponent, onMounted, SetupContext} from "@vue/composition-api";
  import usePresets from "@/options/compositions/presetComposition"
  import PresetListItem from "@/options/components/PresetListItem.vue";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";

  export default createComponent({
    components:{
      PresetListItem,
      AppLocalizationText
    },
    setup(_, context: SetupContext) {
      //プリセット用の composition function を用意
      const {state, init, readPresets, createPreset, deletePreset} = usePresets();

      /**
       * プリセットを追加し、編集画面へ移動する
       */
      const _create = () => {
        createPreset()
          .then(index => {
            context.root.$router.push('/edit/'+String(index));
          });
      };

      /**
       * 対象のプリセットを削除する
       */
      const _delete = (index: number) => {
        deletePreset(index)
          .then(() => {
            return readPresets();
          });
      };

      //プリセットを読み込む
      onMounted(() => {
        //プリセットの初期化
        init()
          .then(() => {
            return readPresets();
          });
      });

      //テンプレートに伝播
      return {state, _create, _delete};
    }
  })
</script>

<style lang="scss" scoped>
  .presetBox{
    margin: 0;
    padding: 0;
  }
  .presetList{
    border-top: 1px solid #CFD8DC;
    padding: 10px 0;
    margin: 0;
    list-style-type: none;
    &:first-child{
      border-top: 0;
    }
  }
  .presetListCreate{
    display: flex;
    justify-content: flex-end;
  }
  .presetCreateButton{
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    margin: 10px 0;
    font-size: 18px;
    font-weight: 700;
  }
</style>
