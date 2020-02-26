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
      <label class="formItemSection">
        <p class="formHeader"><AppLocalizationText msg="msg_refine_target"></AppLocalizationText></p>
        <select
          class="formInput formInput"
          :value="coordinate.type"
          @input="changeType"
        >
          <option value="style"><AppLocalizationText msg="msg_style"></AppLocalizationText></option>
          <option value="augment"><AppLocalizationText msg="msg_attribute"></AppLocalizationText></option>
          <option value="tag"><AppLocalizationText msg="msg_tag"></AppLocalizationText></option>
        </select>
      </label>
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
        <input
          class="formInput formInput"
          :value="coordinate.key"
          type="text"
          @change="changeKey"
        >
      </label>
      <label
        v-if="coordinate.type !== 'tag'"
        class="formItemSection"
      >
        <p
          v-if="coordinate.type === 'style'"
          class="formHeader"
        ><AppLocalizationText msg="msg_value"></AppLocalizationText></p>
        <span v-else-if="coordinate.type === 'augment'"><AppLocalizationText msg="msg_attribute_name"></AppLocalizationText></span>
        <input
          class="formInput formInput"
          :value="coordinate.values"
          type="text"
          @change="changeValue"
        >
      </label>
    </div>
  </div>
</template>

<script lang="ts">
  import {createComponent, ref, SetupContext} from "@vue/composition-api";
  import {Coordinate} from "@/settings/interface";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppButton from "@/options/components/AppButton.vue";

  type Prop = {
    coordinate: Coordinate,
    index: number
  };

  export default createComponent({
    components: {
      AppLocalizationText,
      AppButton
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
      const changeType = (e: Event) => {
        context.emit('change-coordinate', {
          coordinate: _createUpdateCoordinate('type', e.target instanceof HTMLSelectElement ? e.target.value : ''),
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
        context.emit('change-coordinate', {
          coordinate: null,
          index: prop.index
        });
      };

      //テンプレートへ伝播
      return {isHover, hoverEnter, hoverLeave, changeType, changeKey, changeValue, deleteCoordinate};
    }
  })
</script>

<style scoped>

</style>
