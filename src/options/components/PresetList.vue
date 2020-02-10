<template>
  <article>
    <h1><AppLocalizationText msg="msg_preset_list"></AppLocalizationText></h1>
    <div v-if="state.init">
      <ul v-if="state.presets.length !== 0">
        <li v-for="(preset, index) in state.presets">
          <PresetListItem
            :index="index"
            :title="preset.title"
            :url="preset.url"
            @delete-preset="_delete"
          ></PresetListItem>
        </li>
      </ul>
      <p v-else><AppLocalizationText
        msg="msg_empty_preset_list"
        key="msg_empty_preset_list"
      ></AppLocalizationText></p>
      <div><button @click="_create"><AppLocalizationText msg="msg_add"></AppLocalizationText></button></div>
    </div>
    <div
      v-else
    >
      <p><AppLocalizationText msg="msg_loading"></AppLocalizationText></p>
    </div>
    <div>
      <router-link
        to="/setting"
      ><AppLocalizationText msg="msg_setting"></AppLocalizationText></router-link>
    </div>
  </article>
</template>

<script lang="ts">
  import {createComponent, onMounted, SetupContext} from "@vue/composition-api";
  import usePresets from "@/options/compositions/presetComposition"
  import PresetListItem from "@/options/components/PresetListItem";
  import AppLocalizationText from "@/options/components/AppLocalizationText";

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

<style scoped>

</style>
