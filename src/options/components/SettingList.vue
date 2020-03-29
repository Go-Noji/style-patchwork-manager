<template>
  <article class="inner">
    <section>
      <h2><AppLocalizationText msg="msg_change_setting"></AppLocalizationText></h2>
      <ul
        v-if="isLoaded"
        class="settingBox"
      >
        <li class="settingList">
          <h3 class="settingTitle">ON / OFF</h3>
          <div>
            <label>
              <AppToggleSwitch
                :enable="state.enable"
                :onText="'ON'"
                :offText="'Off'"
                @click-switch="changeEnableData"
              ></AppToggleSwitch>
              <p><AppLocalizationText msg="msg_enable"></AppLocalizationText></p>
            </label>
          </div>
        </li>
        <li class="settingList">
          <p><AppLocalizationText msg="msg_storage"></AppLocalizationText></p>
          <div>
            <AppTab
              :tabs="{sync: 'sync', local: 'local'}"
              :current="state.storage"
              @click-tab="changeStorageData"
            ></AppTab>
            <p><AppLocalizationText msg="msg_storage_attentions"></AppLocalizationText></p>
          </div>
        </li>
        <li class="settingList">
          <h3 class="settingTitle"><AppLocalizationText msg="msg_delete_confirm_setting"></AppLocalizationText></h3>
          <div>
            <AppToggleSwitch
              :enable="state.deleteConfirm"
              :onText="'Yes'"
              :offText="'No'"
              @click-switch="changeDeleteConfirm"
            ></AppToggleSwitch>
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
      <h2><AppLocalizationText msg="msg_backup"></AppLocalizationText></h2>
      <ul class="settingBox">
        <li class="settingList">
          <h3 class="settingTitle"><AppLocalizationText msg="msg_export_settings"></AppLocalizationText></h3>
          <div>
            <p><AppLocalizationText msg="msg_export_description"></AppLocalizationText></p>
            <p><AppButton
              keyColor="#607D8B"
              baseColor="#FAFAFA"
              @click-button="exportSettingJson"
            ><AppLocalizationText msg="msg_export"></AppLocalizationText></AppButton></p>
          </div>
        </li>
        <li class="settingList">
          <h3 class="settingTitle"><AppLocalizationText msg="msg_import_settings"></AppLocalizationText></h3>
          <div>
            <AppLocalizationText msg="msg_import_description"></AppLocalizationText>
            <p><AppFileInput
              keyColor="#607D8B"
              baseColor="#FAFAFA"
              @change-file="importSettingJson"
            ><AppLocalizationText msg="msg_import"></AppLocalizationText></AppFileInput></p>
          </div>
        </li>
      </ul>
    </section>
    <section>
      <h2><AppLocalizationText msg="msg_information"></AppLocalizationText></h2>
      <ul class="settingBox">
        <li class="settingList">
          <h3 class="settingTitle"><AppLocalizationText msg="msg_version"></AppLocalizationText></h3>
          <div>
            <p>{{state.version}}</p>
          </div>
        </li>
        <li class="settingList">
          <h3 class="settingTitle"><AppLocalizationText msg="msg_used_byte"></AppLocalizationText></h3>
          <div>
            <p><AppLocalizationText msg="msg_using_byte"></AppLocalizationText>: {{new Intl.NumberFormat().format(state.bytes)}}</p>
            <p><AppLocalizationText msg="msg_remaining_byte"></AppLocalizationText>: {{new Intl.NumberFormat().format(remainingAvailableBytes)}}</p>
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
  import {ref, createComponent, onMounted, computed, inject} from "@vue/composition-api";
  import {USE_SETTING} from "@/options/compositions/settingComposition"
  import {STORAGE_LIMIT_SYNC, STORAGE_LIMIT_LOCAL} from "@/settings/settings";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppToggleSwitch from "@/options/components/AppToggleSwitch.vue";
  import AppButton from "@/options/components/AppButton.vue";
  import AppFileInput from "@/options/components/AppFileInput.vue";
  import AppTab from "@/options/components/AppTab.vue";

  export default createComponent({
    components: {AppLocalizationText, AppToggleSwitch, AppButton, AppFileInput, AppTab},
    setup() {
      //プリセット用の composition function を用意
      const settting = inject(USE_SETTING);

      //composition function の絞り込み
      if (settting === undefined) {
        return;
      }

      //読み込み完了フラグ
      const isLoaded = ref(false);

      /**
       * storage を変更する
       * @param event
       */
      const changeStorageData = async (type: string) => {
        //提供された値が storage の型にそぐわない場合は何もしない
        if (type !== 'sync' && type !== 'local') {
          return;
        }

        //更新を行う
        await settting.changeStorage(type);
      };

      /**
       * enable を変更する
       * @param event
       */
      const changeEnableData = async () => {
        await settting.changeEnable( ! settting.state.enable);
      };

      /**
       * deleteConfirm を変更する
       */
      const changeDeleteConfirm = async () => {
        await settting.changeDeleteConfirm( ! settting.state.deleteConfirm);
      };

      /**
       * 現在の残り使用可能バイト数を返す
       */
      const remainingAvailableBytes = computed((): number => {
        if (settting.state.storage === "sync") {
          return STORAGE_LIMIT_SYNC < settting.state.bytes ? 0 : STORAGE_LIMIT_SYNC - settting.state.bytes;
        } else {
          return STORAGE_LIMIT_LOCAL < settting.state.bytes ? 0 : STORAGE_LIMIT_LOCAL - settting.state.bytes;
        }
      });

      /**
       * 現在の設定を JSON ファイルとしてエクスポートする
       */
      const exportSettingJson = async () => {
        //JSON ファイルにする文字列を入手
        const json = await settting.exportFileString();

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
      const importSettingJson = async (file: File) => {
        //ファイル読み込みオブジェクトを用意
        const reader = new FileReader();

        //ファイルを読み込む
        await reader.readAsText(file);

        //ファイルが読み込めたらインポートを開始する
        reader.addEventListener('load', () => {
          //ファイルが文字列にならなかったら何もしない
          if (typeof reader.result !== 'string') {
            return;
          }

          //インポートを試みる
          settting.importFileString(reader.result);
        });
      };

      //状態を読み込む
      onMounted(() => {
        settting.getSettings()
          .then(() => {
            //読み込みが正常に完了
            isLoaded.value = true;
          });
      });

      //テンプレートに伝播
      return {state: settting.state, isLoaded, remainingAvailableBytes, changeDeleteConfirm, changeStorageData, changeEnableData, exportSettingJson, importSettingJson};
    }
  })
</script>

<style lang="scss" scoped>
  .settingBox{
    margin: 10px 0 60px 0;
    padding: 0;
  }
  .settingList{
    margin: 15px 0 0 0;
    border-top: #607D8B solid 1px;
    padding: 15px 0 0 0;
    list-style-type: none;
    &:first-child{
      border-top: 0;
    }
  }
  .settingTitle{
    font-size: 18px;
    font-weight: 700;
  }
</style>
