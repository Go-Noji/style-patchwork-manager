<template>
  <section>
    <h4>定義{{index}}</h4>
    <section>
      <h5>適用条件</h5>
      <ul>
        <li
          v-for="(coordinate, coordinateIndex) in define.coordinates"
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
        type="button"
        @click="createDefineCoordinate"
      >適用条件を追加</button>
    </section>
    <section>
      <h5>適用スタイル</h5>
      <ul>
        <li
          v-for="(style, styleIndex) in define.styles"
          :key="'style_'+styleIndex"
        >
          <PresetEditDefineStyle
            :data="style"
            :index="styleIndex"
            @change-style="changeStyle"
          ></PresetEditDefineStyle>
        </li>
      </ul>
      <button
        :key="'deleteDefineButton'+index"
        type="button"
        @click="createDefineStyle"
      >適用スタイルを追加</button>
    </section>
    <button
      type="button"
      @click="deleteDefine"
    >定義を削除</button>
  </section>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";
  import {Coordinate, Define, Style} from "@/settings/interface";
  import PresetEditDefineCoordinate from "@/options/PresetEditDefineCoordinate";
  import PresetEditDefineStyle from "@/options/PresetEditDefineStyle";

  type Prop = {
    index: number,
    define: Define
  };

  export default createComponent({
    components: {
      PresetEditDefineCoordinate,
      PresetEditDefineStyle
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

      //Styles の変更を親へ伝播する
      const changeStyle = (data: {style: Style, index: number}) => {
        //styles のコピーを作成し、対象 index の style のみ書き換える
        const styles: Style[] = [...prop.define.styles];
        styles.splice(data.index, 1, data.style);

        //伝播
        context.emit('change-define', {defineIndex: prop.index, define: {...prop.define, styles}});
      };

      //定義の削除
      const deleteDefine = () => {
        context.emit('delete-define', prop.index);
      };

      //適用条件の追加
      const createDefineCoordinate = () => {
        context.emit('create-define-coordinate', prop.index);
      };

      //適用スタイルの追加
      const createDefineStyle = () => {
        context.emit('create-define-style', prop.index);
      };

      //テンプレートへ伝播
      return {changeCoordinate, changeStyle, deleteDefine, createDefineCoordinate, createDefineStyle};
    }
  })
</script>

<style scoped>

</style>
