<template>
  <div>
    <label>
      <span>CSS プロパティ名</span>
      <input
        :value="data.property"
        type="text"
        @change="changeStyleProperty"
      >
    </label>
    <label>
      <span>値</span>
      <input
        :value="data.values"
        type="text"
        @change="changeStyleValues"
      >
    </label>
  </div>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";
  import {Style} from "@/settings/interface";

  type Prop = {
    data: Style,
    index: number
  };

  export default createComponent({
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
      //プロパティの変更を親へ伝播する
      const changeStyleProperty = (e: Event) => {
        context.emit('change-style', {
          style: {
            ...prop.data,
            property: e.target instanceof HTMLInputElement ? e.target.value : ''
          },
          index: prop.index
        });
      };

      //値の変更を親へ伝播する
      const changeStyleValues = (e: Event) => {
        context.emit('change-style', {
          style: {
            ...prop.data,
            values: e.target instanceof HTMLInputElement ? e.target.value : ''
          },
          index: prop.index
        });
      };

      //テンプレートへ伝播
      return {changeStyleProperty, changeStyleValues};
    }
  })
</script>

<style scoped>

</style>
