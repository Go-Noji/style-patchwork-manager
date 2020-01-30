<template>
  <article>
    <h1>設定リスト</h1>
    <div v-if="state.init">
      <ul v-if="state.presets.length !==0">
        <li v-for="(preset, index) in state.presets">
          <PresetListItem
            :index="index"
            :title="preset.title"
            :url="preset.url"
            @delete-preset="_delete"
          ></PresetListItem>
        </li>
      </ul>
      <p v-else>プリセットは未登録です</p>
      <div><button @click="_create">プリセットを追加する</button></div>
    </div>
    <div
      v-else
    >
      <p>読み込み中...</p>
    </div>
    <div>
      <router-link
        to="/setting"
      >設定</router-link>
    </div>
  </article>
</template>

<script lang="ts">
  import {createComponent, onMounted, reactive, ref, SetupContext} from "@vue/composition-api";
  import PresetListItem from "@/options/PresetListItem";
  import usePresets from "@/options/presetComposition"

  export default createComponent({
    components:{
      PresetListItem
    },
    setup(_, context: SetupContext) {
      //プリセット用の composition function を用意
      const {state, init, readPresets, createPreset, deletePreset} = usePresets();

      //エラーメッセージ
      const message = ref<string>();

      /**
       * プリセットを追加し、編集画面へ移動する
       */
      const _create = () => {
        createPreset()
          .then(index => {
            context.root.$router.push('/edit/'+String(index));
          })
          .catch(() => {
            message.value = state.error;
          });
      };

      /**
       * 対象のプリセットを削除する
       */
      const _delete = (index: number) => {
        deletePreset(index)
          .then(() => {
            return readPresets();
          })
          .catch(() => {
            message.value = state.error;
          });
      };

      /**
       * プリセットを読み込む
       */
      onMounted(() => {
        //プリセットの初期化
        init()
          .then(() => {
            return readPresets();
          })
          .catch(() => {
            message.value = 'Chrome からプリセットの読み込みに失敗しました';
          });
      });

      //テンプレートに伝播
      return {state, message, _create, _delete};
    }
  })
</script>

<style scoped>

</style>
