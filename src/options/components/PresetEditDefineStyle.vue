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
  </div>
</template>

<script lang="ts">
  import {createComponent, ref, SetupContext} from "@vue/composition-api";
  import {Style} from "@/settings/interface";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppButton from "@/options/components/AppButton.vue";

  type Prop = {
    data: Style,
    index: number
  };

  export default createComponent({
    components: {
      AppLocalizationText,
      AppButton
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
        context.emit('change-style', {
          style: null,
          index: prop.index
        });
      };

      //テンプレートへ伝播
      return {isHover, hoverEnter, hoverLeave, changeStyleProperty, changeStyleValues, deleteStyle};
    }
  })
</script>

<style scoped>

</style>
