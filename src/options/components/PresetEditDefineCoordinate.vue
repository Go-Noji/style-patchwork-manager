<template>
  <div
    :class="{hoverShadow: isHover}"
    class="formWrapper"
  >
    <div class="formDeleteButtonWrapper">
      <button
        class="formDeleteButton"
        @click="deleteCoordinate"
        @mouseenter="hoverEnter"
        @mouseleave="hoverLeave"
      ><img
        svg-inline
        class="formDeleteButtonImage"
        src="@/assets/cancel.svg"
      ></button>
    </div>
    <div class="formFormArea">
      <div class="formBlock">
        <label class="formItemSection">
          <p class="formHeader"><AppLocalizationText msg="msg_refine_target"></AppLocalizationText></p>
          <div class="formInputArea">
            <AppTab
              :tabs="tabs"
              :current="coordinate.type"
              @click-tab="changeType"
            ></AppTab>
          </div>
        </label>
      </div>
      <div class="formBlock">
        <label class="formItemSection">
          <p
            v-if="coordinate.type === 'style'"
            key="styleTitle"
            class="formHeader"
          ><AppLocalizationText msg="msg_css_property_name"></AppLocalizationText></p>
          <p
            v-else-if="coordinate.type === 'augment'"
            key="augmentTitle"
            class="formHeader"
          ><AppLocalizationText msg="msg_html_attribute_name"></AppLocalizationText></p>
          <p
            v-else-if="coordinate.type === 'tag'"
            key="tagTitle"
            class="formHeader"
          ><AppLocalizationText msg="msg_html_tag_name"></AppLocalizationText></p>
          <div class="formInputArea">
            <input
              class="formInput formInput"
              :value="coordinate.key"
              type="text"
              @change="changeKey"
            >
          </div>
        </label>
        <label
          v-if="coordinate.type !== 'tag'"
          class="formItemSection"
        >
          <p
            v-if="coordinate.type === 'style'"
            class="formHeader"
          ><AppLocalizationText msg="msg_value"></AppLocalizationText></p>
          <p
            v-else-if="coordinate.type === 'augment'"
            class="formHeader"
          ><AppLocalizationText msg="msg_attribute_name"></AppLocalizationText></p>
          <div class="formInputArea">
            <input
              class="formInput formInput"
              :value="coordinate.values"
              type="text"
              @change="changeValue"
            >
          </div>
        </label>
      </div>
    </div>
    <AppModal
      v-show="deleteModalFlag"
      @click-outer="deleteModalFlag = false"
    >
      <AppModalDeleteWindow
        @click-delete="deleteCoordinate"
        @click-back="deleteModalFlag = false"
      >
        <p><AppLocalizationText msg="msg_delete_attention"></AppLocalizationText></p>
      </AppModalDeleteWindow>
    </AppModal>
  </div>
</template>

<script lang="ts">
  import {createComponent, inject, ref, SetupContext} from "@vue/composition-api";
  import {Coordinate} from "@/settings/interface";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppButton from "@/options/components/AppButton.vue";
  import AppTab from "@/options/components/AppTab.vue";
  import AppModal from "@/options/components/AppModal.vue";
  import AppModalDeleteWindow from "@/options/components/AppModalDeleteWindow.vue";
  import {USE_SETTING} from "@/options/compositions/settingComposition";

  type Prop = {
    coordinate: Coordinate,
    index: number
  };

  export default createComponent({
    components: {
      AppLocalizationText,
      AppButton,
      AppTab,
      AppModal,
      AppModalDeleteWindow
    },
    props: {
      coordinate: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true
      }
    },
    setup(prop: Prop, context: SetupContext) {
      //選択肢
      const tabs = {
        style: chrome.i18n.getMessage('msg_style'),
        augment: chrome.i18n.getMessage('msg_attribute'),
        tag: chrome.i18n.getMessage('msg_tag')
      };

      //削除ボタンにホバーしているかどうか
      const isHover = ref(false);

      //削除モーダルの表示フラグ
      const deleteModalFlag = ref(false);

      //設定用の composition function を用意
      const setting = inject(USE_SETTING);

      //composition function の絞り込み
      if (setting === undefined) {
        return;
      }

      /**
       * ホバーを検知
       */
      const hoverEnter = () => {
        isHover.value = true;
      };

      /**
       * ホバーアウトを検知
       */
      const hoverLeave = () => {
        isHover.value = false;
      };

      /**
       * key で指定した値を value に変更した Coordinate データを返す
       * @param key
       * @param input
       * @private
       */
      const _createUpdateCoordinate = (key: 'type' | 'key' | 'values', value: string): Coordinate => {
        return {...prop.coordinate, [key]: value};
      };

      /**
       * type の変更を親に伝播
       * @param e
       */
      const changeType = (type: string) => {
        context.emit('change-coordinate', {
          coordinate: _createUpdateCoordinate('type', type),
          index: prop.index
        });
      };

      /**
       * key の変更を親に伝播
       * @param e
       */
      const changeKey = (e: Event) => {
        context.emit('change-coordinate', {
          coordinate: _createUpdateCoordinate('key', e.target instanceof HTMLInputElement ? e.target.value : ''),
          index: prop.index
        });
      };

      /**
       * values の変更を親に伝播
       * 親に伝播
       * @param e
       */
      const changeValue = (e: Event) => {
        context.emit('change-coordinate', {
          coordinate: _createUpdateCoordinate('values', e.target instanceof HTMLInputElement ? e.target.value : ''),
          index: prop.index
        });
      };

      /**
       * 削除を親に伝播
       */
      const deleteCoordinate = () => {
        //削除モーダルが表示されておらず、かつ確認フラグが true ならモーダルを表示して終了
        if ( ! deleteModalFlag.value && setting.state.deleteConfirm) {
          deleteModalFlag.value = true;
          return;
        }

        //モーダルが表示されていたら非表示にする
        deleteModalFlag.value = false;

        //削除実行
        context.emit('change-coordinate', {
          coordinate: null,
          index: prop.index
        });
      };

      //テンプレートへ伝播
      return {tabs, isHover, deleteModalFlag, hoverEnter, hoverLeave, changeType, changeKey, changeValue, deleteCoordinate};
    }
  })
</script>

<style scoped>

</style>
