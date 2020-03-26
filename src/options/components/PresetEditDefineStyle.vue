<template>
  <div
    :class="{hoverShadow: isHover}"
    class="formWrapper"
  >
    <div class="formDeleteButtonWrapper">
      <button
        class="formDeleteButton"
        @click="deleteStyle"
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
          <p class="formHeader"><AppLocalizationText msg="msg_css_property_name"></AppLocalizationText></p>
          <div class="formInputArea">
            <input
              class="formInput formInput"
              :value="data.property"
              type="text"
              @change="changeStyleProperty"
            >
          </div>
        </label>
        <label class="formItemSection">
          <span class="formHeader"><AppLocalizationText msg="msg_value"></AppLocalizationText></span>
          <div class="formInputArea">
            <input
              class="formInput formInput"
              :value="data.values"
              type="text"
              @change="changeStyleValues"
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
        @click-delete="deleteStyle"
        @click-back="deleteModalFlag = false"
      >
        <p><AppLocalizationText msg="msg_delete_attention"></AppLocalizationText></p>
      </AppModalDeleteWindow>
    </AppModal>
  </div>
</template>

<script lang="ts">
  import {createComponent, inject, ref, SetupContext} from "@vue/composition-api";
  import {Style} from "@/settings/interface";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppButton from "@/options/components/AppButton.vue";
  import AppModal from "@/options/components/AppModal.vue";
  import AppModalDeleteWindow from "@/options/components/AppModalDeleteWindow.vue";
  import {USE_SETTING} from "@/options/compositions/settingComposition";

  type Prop = {
    data: Style,
    index: number
  };

  export default createComponent({
    components: {
      AppLocalizationText,
      AppButton,
      AppModal,
      AppModalDeleteWindow
    },
    props: {
      data: {
        type: Object,
      },
      index: {
        type: Number,
        required: true
      }
    },
    setup(prop: Prop, context: SetupContext) {
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
       * プロパティの変更を親へ伝播する
       * @param e
       */
      const changeStyleProperty = (e: Event) => {
        context.emit('change-style', {
          style: {
            ...prop.data,
            property: e.target instanceof HTMLInputElement ? e.target.value : ''
          },
          index: prop.index
        });
      };

      /**
       * 値の変更を親へ伝播する
       * @param e
       */
      const changeStyleValues = (e: Event) => {
        context.emit('change-style', {
          style: {
            ...prop.data,
            values: e.target instanceof HTMLInputElement ? e.target.value : ''
          },
          index: prop.index
        });
      };

      /**
       * 削除を親に伝播
       */
      const deleteStyle = () => {
        //削除モーダルが表示されておらず、かつ確認フラグが true ならモーダルを表示して終了
        if ( ! deleteModalFlag.value && setting.state.deleteConfirm) {
          deleteModalFlag.value = true;
          return;
        }

        //モーダルが表示されていたら非表示にする
        deleteModalFlag.value = false;

        //削除実行
        context.emit('change-style', {
          style: null,
          index: prop.index
        });
      };

      //テンプレートへ伝播
      return {isHover, deleteModalFlag, hoverEnter, hoverLeave, changeStyleProperty, changeStyleValues, deleteStyle};
    }
  })
</script>

<style scoped>

</style>
