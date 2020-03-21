<template>
  <div class="container deleteWindowWrapper">
    <div class="deleteWindowContents"><slot></slot></div>
    <div class="deleteWindowContents deleteWindowSwitchWrapper">
      <p class="deleteWindowSwitchMessage"><AppLocalizationText msg="msg_delete_confirm_change"></AppLocalizationText>: </p>
      <AppToggleSwitch
        :enable=" ! state.deleteConfirm"
        :onText="'Yes'"
        :offText="'No'"
        @click-switch="changeDeleteConfirm"
      ></AppToggleSwitch>
    </div>
    <div class="deleteWindowButtonsArea">
      <AppButton
        keyColor="#607D8B"
        baseColor="#FAFAFA"
        class="deleteWindowButton"
        @click-button="clickDelete"
      ><AppLocalizationText msg="msg_delete"></AppLocalizationText></AppButton>
      <AppButton
        keyColor="#607D8B"
        baseColor="#FAFAFA"
        class="deleteWindowButton"
        @click-button="clickBack"
      ><AppLocalizationText msg="msg_back"></AppLocalizationText></AppButton>
    </div>
  </div>
</template>

<script lang="ts">
  import {createComponent, inject, SetupContext} from "@vue/composition-api";
  import {USE_SETTING} from "@/options/compositions/settingComposition";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppButton from "@/options/components/AppButton.vue";
  import AppToggleSwitch from "@/options/components/AppToggleSwitch.vue";

  export default createComponent({
    components: {
      AppLocalizationText,
      AppButton,
      AppToggleSwitch
    },
    setup(_, context: SetupContext) {

      //設定用の composition function を用意
      const setting = inject(USE_SETTING);

      //composition function の絞り込み
      if (setting === undefined) {
        return;
      }

      //削除を実行するイベントを親へ伝播
      const clickDelete = () => {
        context.emit('click-delete');
      };

      //削除をキャンセルするイベントを親へ伝播
      const clickBack = () => {
        context.emit('click-back');
      };

      //モーダルの表示設定を変更する
      const changeDeleteConfirm = async () => {
        //更新を行う
        await setting.changeDeleteConfirm( ! setting.state.deleteConfirm);
      };

      //伝播
      return {
        state: setting.state,
        clickDelete,
        clickBack,
        changeDeleteConfirm
      };
    }
  });
</script>

<style scoped lang="scss">
  .deleteWindowWrapper{
    padding: 60px;
    width: 100%;
    min-width: 450px;
  }
  .deleteWindowContents{
    margin: 20px;
    text-align: center;
  }
  .deleteWindowSwitchWrapper{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .deleteWindowSwitchMessage{
    font-size: 12px;
    margin-right: 10px;
  }
  .deleteWindowButtonsArea{
    display: flex;
    justify-content: center;
  }
  .deleteWindowButton{
    margin: 10px;
  }
</style>
