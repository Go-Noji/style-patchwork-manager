<template>
  <section>
    <h4>定義{{prop.index}}</h4>
    <section>
      <h5>適用条件</h5>
      <ul>
        <li
          v-for="(coordinate, coordinateIndex) in prop.define.coordinates"
          :key="'coordinate_'+coordinateIndex"
        >
          <PresetEditDefineCoordinate
            :coordinate="coordinate"
            :index="coordinateIndex"
            @change-coordinate="changeCoordinate"
          ></PresetEditDefineCoordinate>
        </li>
      </ul>
      <button
        :key="'deleteDefineButton'+prop.index"
        type="button"
        @click="addDefineCoordinate"
      >適用条件を追加</button>
    </section>
    <button
      type="button"
      @click="deleteDefine"
    >定義を削除</button>
  </section>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";
  import {Coordinate, Define} from "@/settings/interface";
  import PresetEditDefineCoordinate from "@/options/PresetEditDefineCoordinate";

  type Prop = {
    index: number,
    define: Define
  };

  export default createComponent({
    components: {
      PresetEditDefineCoordinate
    },
    props: {
      index: {
        type: Number,
        required: true
      },
      define: {
        type: Object,
        required: true
      }
    },
    setup(prop: Prop, context: SetupContext) {
      //Coordinates の変更を親へ伝播する
      const changeCoordinate = (data: {coordinate: Coordinate, index: number}) => {
        //coordinates のコピーを作成し、対象 index の coordinate のみ書き換える
        const coordinates: Coordinate[] = [...prop.define.coordinates];
        coordinates.splice(data.index, 1, data.coordinate);

        //伝播
        context.emit('change-define', {defineIndex: prop.index, define: {...prop.define, coordinates}});
      };

      //定義の削除
      const deleteDefine = () => {
        context.emit('delete-define', prop.index);
      };

      //適用条件の追加
      const addDefineCoordinate = () => {
        context.emit('add-define-coordinate', prop.index);
      };

      //テンプレートへ伝播
      return {prop, changeCoordinate, deleteDefine, addDefineCoordinate};
    }
  })
</script>

<style scoped>

</style>
