<template>
  <article>
    <h1>設定</h1>
    <section>
      <h2>設定変更</h2>
      <ul
        v-if="isLoaded"
      >
        <li>
          <p>ON / OFF</p>
          <div>
            <label>
              <span>動作させる</span>
              <input
                v-model="state.enable"
                type="checkbox"
                name="enable"
                @input="changeEnableData"
              >
            </label>
          </div>
        </li>
        <li>
          <p>保存先</p>
          <div>
            <label>
              <span>sync</span>
              <input
                v-model="state.storage"
                type="radio"
                name="storage"
                value="sync"
                @input="changeStorageData"
              >
            </label>
            <label>
              <span>local</span>
              <input
                v-model="state.storage"
                type="radio"
                name="storage"
                value="local"
                @input="changeStorageData"
              >
            </label>
          </div>
        </li>
      </ul>
      <div
        v-else
      >
        <p>設定読み込み中...</p>
      </div>
    </section>
    <div>
      <router-link
        to="/"
      >プリセット一覧へ戻る</router-link>
    </div>
  </article>
</template>

<script lang="ts">
  import {ref, createComponent, onMounted} from "@vue/composition-api";
  import useSetting from "@/options/settingComposition"

  export default createComponent({
    setup() {
      //設定用の composition function を用意
      const {state, getSettings, changeStorage, changeEnable} = useSetting();

      //読み込み完了フラグ
      const isLoaded = ref(false);

      /**
       * storage を変更する
       * @param event
       */
      const changeStorageData = async (event: Event) => {
        //情報の提供元が input でなければ何もしない
        if ( ! (event.target instanceof HTMLInputElement)) {
          return;
        }

        //提供された値が storage の型にそぐわない場合は何もしない
        if (event.target.value !== 'sync' && event.target.value !== 'local') {
          return;
        }

        //更新を行う
        await changeStorage(event.target.value);
      };

      /**
       * enable を変更する
       * @param event
       */
      const changeEnableData = async (event: Event) => {
        //情報の提供元が input でなければ何もしない
        if ( ! (event.target instanceof HTMLInputElement)) {
          return;
        }

        //更新を行う
        await changeEnable(event.target.checked);
      };

      //状態を読み込む
      onMounted(() => {
        getSettings()
        .then(() => {
          //読み込みが正常に完了
          isLoaded.value = true;
        });
      });

      //テンプレートに伝播
      return {state, isLoaded, changeStorageData, changeEnableData};
    }
  })
</script>

<style scoped>

</style>
