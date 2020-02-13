<template>
  <div>
    <label>
      <span><AppLocalizationText msg="msg_refine_target"></AppLocalizationText></span>
      <select
        :value="coordinate.type"
        @input="changeType"
      >
        <option value="style"><AppLocalizationText msg="msg_style"></AppLocalizationText></option>
        <option value="augment"><AppLocalizationText msg="msg_attribute"></AppLocalizationText></option>
        <option value="tag"><AppLocalizationText msg="msg_tag"></AppLocalizationText></option>
      </select>
    </label>
    <label>
      <span v-if="coordinate.type === 'style'"><AppLocalizationText msg="msg_css_property_name"></AppLocalizationText></span>
      <span v-else-if="coordinate.type === 'augment'"><AppLocalizationText msg="msg_html_attribute_name"></AppLocalizationText></span>
      <span v-else-if="coordinate.type === 'tag'"><AppLocalizationText msg="msg_html_tag_name"></AppLocalizationText></span>
      <input
        :value="coordinate.key"
        type="text"
        @change="changeKey"
      >
    </label>
    <label v-if="coordinate.type !== 'tag'">
      <span v-if="coordinate.type === 'style'"><AppLocalizationText msg="msg_value"></AppLocalizationText></span>
      <span v-else-if="coordinate.type === 'augment'"><AppLocalizationText msg="msg_attribute_name"></AppLocalizationText></span>
      <input
        :value="coordinate.values"
        type="text"
        @change="changeValue"
      >
    </label>
    <label>
      <button
        type="button"
        @click="deleteCoordinate"
      ><AppLocalizationText msg="msg_delete"></AppLocalizationText></button>
    </label>
  </div>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";
  import {Coordinate} from "@/settings/interface";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";

  type Prop = {
    coordinate: Coordinate,
    index: number
  };

  export default createComponent({
    components: {
      AppLocalizationText
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
      return {changeType, changeKey, changeValue, deleteCoordinate};
    }
  })
</script>

<style scoped>

</style>
