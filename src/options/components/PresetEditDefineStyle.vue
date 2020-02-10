<template>
  <div>
    <label>
      <span><AppLocalizationText msg="msg_css_property_name"></AppLocalizationText></span>
      <input
        :value="data.property"
        type="text"
        @change="changeStyleProperty"
      >
    </label>
    <label>
      <span><AppLocalizationText msg="msg_value"></AppLocalizationText></span>
      <input
        :value="data.values"
        type="text"
        @change="changeStyleValues"
      >
    </label>
    <label>
      <button
        type="button"
        @click="deleteStyle"
      ><AppLocalizationText msg="msg_delete"></AppLocalizationText></button>
    </label>
  </div>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";
  import {Style} from "@/settings/interface";
  import AppLocalizationText from "@/options/components/AppLocalizationText";

  type Prop = {
    data: Style,
    index: number
  };

  export default createComponent({
    components: {AppLocalizationText},
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
      return {changeStyleProperty, changeStyleValues, deleteStyle};
    }
  })
</script>

<style scoped>

</style>
