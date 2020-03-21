<template>
  <section
    :class="{hoverShadow: isHover}"
    class="defineWrapper"
  >
    <div class="defineTitleWrapper">
      <div class="formDeleteButtonWrapper">
        <button
          class="formDeleteButton"
          @click="deleteDefine"
          @mouseenter="hoverEnter"
          @mouseleave="hoverLeave"
        ><img
          svg-inline
          class="formDeleteButtonImage"
          src="@/assets/cancel.svg"
        ></button>
      </div>
      <h4><AppLocalizationText msg="msg_definition"></AppLocalizationText>{{index + 1}}</h4>
    </div>
    <section>
      <h5 class="defineTitle"><AppLocalizationText msg="msg_applicable_condition"></AppLocalizationText></h5>
      <ul class="defineBox">
        <li
          v-for="(coordinate, coordinateIndex) in define.coordinates"
          :key="'coordinate_'+coordinateIndex"
          class="defineList"
        >
          <PresetEditDefineCoordinate
            :coordinate="coordinate"
            :index="coordinateIndex"
            @change-coordinate="changeCoordinate"
          ></PresetEditDefineCoordinate>
        </li>
      </ul>
      <div class="defineButtonWrapper">
        <AppButton
          keyColor="#000"
          baseColor="#FAFAFA"
          @click-button="createDefineCoordinate"
        ><AppLocalizationText msg="msg_applicable_condition"></AppLocalizationText>&nbsp;<AppLocalizationText msg="msg_add"></AppLocalizationText></AppButton>
      </div>
      </section>
    <section>
      <h5 class="defineTitle"><AppLocalizationText msg="msg_applicable_style"></AppLocalizationText></h5>
      <ul class="defineBox">
        <li
          v-for="(style, styleIndex) in define.styles"
          :key="'style_'+styleIndex"
          class="defineList"
        >
          <PresetEditDefineStyle
            :data="style"
            :index="styleIndex"
            @change-style="changeStyle"
          ></PresetEditDefineStyle>
        </li>
      </ul>
      <div class="defineButtonWrapper">
        <AppButton
          keyColor="#000"
          baseColor="#FAFAFA"
          @click-button="createDefineStyle"
        ><AppLocalizationText msg="msg_applicable_style"></AppLocalizationText>&nbsp;<AppLocalizationText msg="msg_add"></AppLocalizationText></AppButton>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
  import {createComponent, ref, SetupContext} from "@vue/composition-api";
  import {Coordinate, Define, Style} from "@/settings/interface";
  import PresetEditDefineCoordinate from "@/options/components/PresetEditDefineCoordinate.vue";
  import PresetEditDefineStyle from "@/options/components/PresetEditDefineStyle.vue";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppButton from "@/options/components/AppButton.vue";

  type Prop = {
    index: number,
    define: Define
  };

  export default createComponent({
    components: {
      PresetEditDefineCoordinate,
      PresetEditDefineStyle,
      AppLocalizationText,
      AppButton
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
      return {isHover, hoverEnter, hoverLeave, changeCoordinate, changeStyle, deleteDefine, createDefineCoordinate, createDefineStyle};
    }
  })
</script>

<style scoped>
  .defineWrapper{
    padding-left: 20px;
    border-left: #9E9E9E solid 2px;
  }
  .defineTitle{
    font-size: 16px;
    margin: 0;
  }
  .defineBox{
    margin: 0;
    padding: 0;
  }
  .defineList{
    list-style-type: none;
  }
  .defineTitleWrapper{
    display: flex;
    align-items: center;
    margin: 20px 0;
  }
  .defineButtonWrapper{
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
  }
</style>
