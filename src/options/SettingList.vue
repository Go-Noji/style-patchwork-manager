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
            <p>※下記「設定をエクスポート」よりバックアップを行ってから変更することを推奨します</p>
            <p>「sync」は保存できるプリセットデータの容量が小さい代わりに全ての Chrome に設定が同期されます</p>
            <p>「local」はこの Chrome にしか設定が適用されない代わりにより多くの保存できるプリセットデータできます</p>
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
    <section>
      <h2>情報</h2>
      <ul>
        <li>
          <p>バージョン</p>
          <div>
            <p>{{state.version}}</p>
          </div>
        </li>
        <li>
          <p>使用バイト数</p>
          <div>
            <p>現在使用中のバイト数: {{new Intl.NumberFormat().format(state.bytes)}}</p>
            <p>残り使用可能なバイト数: {{new Intl.NumberFormat().format(remainingAvailableBytes)}}</p>
          </div>
        </li>
      </ul>
    </section>
    <section>
      <h2>バックアップ</h2>
      <ul>
        <li>
          <p>設定をエクスポート</p>
          <div>
            <p>プリセットデータ、各種設定を JSON 形式のファイルでエクスポートします</p>
            <p><button @click="exportSettingJson">エクスポート</button></p>
          </div>
        </li>
        <li>
          <p>設定をインポート</p>
          <div>
            <p>エクスポートしたデータをインポートできます</p>
            <p>プリセット・設定が全て書き換わるのでご注意ください</p>
            <p><input type="file" @change="importSettingJson"></p>
          </div>
        </li>
      </ul>
    </section>
    <div>
      <router-link
        to="/"
      >プリセット一覧へ戻る</router-link>
    </div>
  </article>
</template>

<script lang="ts">
  import {ref, createComponent, onMounted, computed} from "@vue/composition-api";
  import useSetting from "@/options/settingComposition"
  import {STORAGE_LIMIT_SYNC, STORAGE_LIMIT_LOCAL} from "@/settings/settings";

  export default createComponent({
    setup() {
      //設定用の composition function を用意
      const {state, getSettings, changeStorage, changeEnable, exportFileString, importFileString} = useSetting();

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

      /**
       * 現在の残り使用可能バイト数を返す
       */
      const remainingAvailableBytes = computed((): number => {
        if (state.storage === "sync") {
          return STORAGE_LIMIT_SYNC < state.bytes ? 0 : STORAGE_LIMIT_SYNC - state.bytes;
        } else {
          return STORAGE_LIMIT_LOCAL < state.bytes ? 0 : STORAGE_LIMIT_LOCAL - state.bytes;
        }
      });

      /**
       * 現在の設定を JSON ファイルとしてエクスポートする
       */
      const exportSettingJson = async () => {
        //JSON ファイルにする文字列を入手
        const json = await exportFileString();

        //文字列が空(=失敗)ならなにもしない
        if (json === '') {
          return;
        }

        //ファイルをダウンロード
        chrome.downloads.download({url: URL.createObjectURL(new Blob([json], {
            type: "application/json"
          })), filename: 'style-patchwork-manager_'+(new Date().getTime())+'.json'});
      };

      /**
       * ファイルを読み込んで設定を適用する
       */
      const importSettingJson = async (event: Event) => {
        //情報の提供元が input でなければ何もしない
        if ( ! (event.target instanceof HTMLInputElement) || event.target.files === null || event.target.files.length < 1) {
          return;
        }

        //ファイル読み込みオブジェクトを用意
        const reader = new FileReader();

        //ファイルを読み込む
        await reader.readAsText(event.target.files[0]);

        //ファイルが読み込めたらインポートを開始する
        reader.addEventListener('load', () => {
          //ファイルが文字列にならなかったら何もしない
          if (typeof reader.result !== 'string') {
            return;
          }

          //インポートを試みる
          importFileString(reader.result);
        });
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
      return {state, isLoaded, remainingAvailableBytes, changeStorageData, changeEnableData, exportSettingJson, importSettingJson};
    }
  })
</script>

<style scoped>

</style>
