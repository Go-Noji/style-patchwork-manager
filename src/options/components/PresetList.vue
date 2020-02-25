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
          <div class="presetListButtonWrapper">
            <AppButton
              keyColor="#212121"
              baseColor="#FAFAFA"
              @click-button="_create"
            ><AppLocalizationText msg="msg_add"></AppLocalizationText></AppButton>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p><AppLocalizationText msg="msg_loading"></AppLocalizationText></p>
    </div>
  </article>
</template>

<script lang="ts">
  import {createComponent, inject, onMounted, SetupContext} from "@vue/composition-api";
  import {USE_PRESET_KEY} from "@/options/compositions/presetComposition"
  import PresetListItem from "@/options/components/PresetListItem.vue";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppButton from "@/options/components/AppButton.vue";

  export default createComponent({
    components:{
      PresetListItem,
      AppLocalizationText,
      AppButton
    },
    setup(_, context: SetupContext) {

      //プリセット用の composition function を用意
      const store = inject(USE_PRESET_KEY);

      //composition function の絞り込み
      if (store === undefined) {
        return;
      }

      /**
       * プリセットを追加し、編集画面へ移動する
       */
      const _create = () => {
        store.createPreset();
      };

      /**
       * 対象のプリセットを削除する
       */
      const _delete = (index: number) => {
        store.deletePreset(index);
      };

      //プリセットを読み込む
      onMounted(() => {
        //プリセットの初期化
        store.init()
          .then(() => {
            return store.readPresets();
          });
      });

      //テンプレートに伝播
      return {state: store.state, _create, _delete};
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
  .presetListButtonWrapper{
    margin: 10px 0;
  }
</style>
