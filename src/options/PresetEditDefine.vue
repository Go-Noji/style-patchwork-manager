<template>
  <section>
    <h4><AppLocalizationText msg="msg_definition"></AppLocalizationText>{{index + 1}}</h4>
    <section>
      <h5><AppLocalizationText msg="msg_applicable_condition"></AppLocalizationText></h5>
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
      ><AppLocalizationText msg="msg_add"></AppLocalizationText></button>
    </section>
    <section>
      <h5><AppLocalizationText msg="msg_applicable_style"></AppLocalizationText></h5>
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
      ><AppLocalizationText msg="msg_add"></AppLocalizationText></button>
    </section>
    <button
      type="button"
      @click="deleteDefine"
    ><AppLocalizationText msg="msg_delete"></AppLocalizationText></button>
  </section>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";
  import {Coordinate, Define, Style} from "@/settings/interface";
  import PresetEditDefineCoordinate from "@/options/PresetEditDefineCoordinate";
  import PresetEditDefineStyle from "@/options/PresetEditDefineStyle";
  import AppLocalizationText from "@/options/AppLocalizationText.vue";

  type Prop = {
    index: number,
    define: Define
  };

  export default createComponent({
    components: {
      PresetEditDefineCoordinate,
      PresetEditDefineStyle,
      AppLocalizationText
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
      /**
       * Coordinates の変更を親へ伝播する
       * @param data
       */
      const changeCoordinate = (data: {coordinate: Coordinate | null, index: number}) => {
        //coordinates のコピーを作成
        const coordinates: Coordinate[] = [...prop.define.coordinates];

        //削除
        if (data.coordinate === null) {
          coordinates.splice(data.index, 1,);
        }

        //更新
        else {
          coordinates.splice(data.index, 1, data.coordinate);
        }

        //伝播
        context.emit('change-define', {defineIndex: prop.index, define: {...prop.define, coordinates}});
      };

      /**
       * Styles の変更を親へ伝播する
       * @param data
       */
      const changeStyle = (data: {style: Style | null, index: number}) => {
        //styles のコピーを作成
        const styles: Style[] = [...prop.define.styles];

        //削除
        if (data.style === null) {
          styles.splice(data.index, 1);
        }

        //更新
        else {
          styles.splice(data.index, 1, data.style);
        }

        //伝播
        context.emit('change-define', {defineIndex: prop.index, define: {...prop.define, styles}});
      };

      /**
       * 定義の削除
       */
      const deleteDefine = () => {
        context.emit('delete-define', prop.index);
      };

      /**
       * 適用条件の追加
       */
      const createDefineCoordinate = () => {
        context.emit('create-define-coordinate', prop.index);
      };

      /**
       * 適用スタイルの追加
       */
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
