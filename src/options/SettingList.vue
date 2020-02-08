<template>
  <article>
    <h1><AppLocalizationText msg="msg_setting"></AppLocalizationText></h1>
    <section>
      <h2><AppLocalizationText msg="msg_change_setting"></AppLocalizationText></h2>
      <ul
        v-if="isLoaded"
      >
        <li>
          <p>ON / OFF</p>
          <div>
            <label>
              <span><AppLocalizationText msg="msg_enable"></AppLocalizationText></span>
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
          <p><AppLocalizationText msg="msg_storage"></AppLocalizationText></p>
          <div>
            <AppLocalizationText msg="msg_storage_attentions"></AppLocalizationText>
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
        <p><AppLocalizationText msg="msg_loading"></AppLocalizationText></p>
      </div>
    </section>
    <section>
      <h2><AppLocalizationText msg="msg_information"></AppLocalizationText></h2>
      <ul>
        <li>
          <p><AppLocalizationText msg="msg_version"></AppLocalizationText></p>
          <div>
            <p>{{state.version}}</p>
          </div>
        </li>
        <li>
          <p><AppLocalizationText msg="msg_used_byte"></AppLocalizationText></p>
          <div>
            <p><AppLocalizationText msg="msg_using_byte"></AppLocalizationText>: {{new Intl.NumberFormat().format(state.bytes)}}</p>
            <p><AppLocalizationText msg="残り使用可能なバイト数"></AppLocalizationText>: {{new Intl.NumberFormat().format(remainingAvailableBytes)}}</p>
          </div>
        </li>
      </ul>
    </section>
    <section>
      <h2><AppLocalizationText msg="msg_backup"></AppLocalizationText></h2>
      <ul>
        <li>
          <p><AppLocalizationText msg="msg_export_settings"></AppLocalizationText></p>
          <div>
            <p><AppLocalizationText msg="msg_export_description"></AppLocalizationText></p>
            <p><button @click="exportSettingJson"><AppLocalizationText msg="msg_export"></AppLocalizationText></button></p>
          </div>
        </li>
        <li>
          <p><AppLocalizationText msg="msg_export_settings"></AppLocalizationText></p>
          <div>
            <AppLocalizationText msg="msg_import_description"></AppLocalizationText>
            <p><input type="file" @change="importSettingJson"></p>
          </div>
        </li>
      </ul>
    </section>
    <div>
      <router-link
        to="/"
      ><AppLocalizationText msg="msg_back"></AppLocalizationText></router-link>
    </div>
  </article>
</template>

<script lang="ts">
  import {ref, createComponent, onMounted, computed} from "@vue/composition-api";
  import useSetting from "@/options/settingComposition"
  import {STORAGE_LIMIT_SYNC, STORAGE_LIMIT_LOCAL} from "@/settings/settings";
  import AppLocalizationText from "@/options/AppLocalizationText.vue";

  export default createComponent({
    components: {AppLocalizationText},
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
