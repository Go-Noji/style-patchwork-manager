<template>
  <ul class="tabWrapper">
    <li
      v-for="(tab, key) in tabs"
      :key="'tab_'+key"
      class="tabList"
    >
      <button
        :class="{tabButtonCurrent: key === current}"
        class="tabButton"
        @click="clickTab(key)"
      >{{tab}}</button>
    </li>
  </ul>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";

  type Props = {
    tabs: {[key: string]: string},
    current: string
  };

  export default createComponent({
    props: {
      tabs: {
        type: Object,
        required: true
      },
      current: {
        type: String,
        required: true
      }
    },
    setup(props: Props, context: SetupContext) {
      //親へクリックイベントを伝播
      const clickTab = (key: string) => {
        context.emit('click-tab', key);
      };

      //伝播
      return {clickTab};
    }
  })
</script>

<style lang="scss" scoped>
  .tabWrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    border: 1px solid #607D8B;
    border-radius: 5px;
    padding: 0;
    overflow: hidden;
  }
  .tabList{
    list-style-type: none;
    min-width: 100px;
    margin: 0;
    padding: 0;
    border-left: 1px solid #607D8B;
    background-color: #FFF;
    color: #212121;
    &:first-child{
      border-left: 0;
    }
  }
  .tabButton{
    appearance: none;
    background-color: transparent;
    width: 100%;
    border: 0;
    padding: 5px 10px;
    cursor: pointer;
    transition: color, background-color .2s ease-out;
  }
  .tabButtonCurrent{
    background-color: #212121;
    color: #FFF;
  }
</style>
