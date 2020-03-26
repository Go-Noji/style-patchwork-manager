<template>
  <button
    :class="{toggleSwitchWrapperEnable: enable}"
    class="toggleSwitchWrapper"
    @click="clickSwitch"
  >
    <span
      :class="{toggleSwitchTextEnable: enable}"
      class="toggleSwitchText"
    >{{enable ? onText : offText}}</span>
    <span
      :class="{toggleSwitchCircleEnable: enable}"
      class="toggleSwitchCircle"
    ></span>
  </button>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";

  type Props = {
    enable: boolean,
    onText: string,
    offText: string
  };

  export default createComponent({
    props: {
      enable: {
        type: Boolean,
        required: true
      },
      onText: {
        type: String,
        required: false,
        default: 'ON'
      },
      offText: {
        type: String,
        required: false,
        default: 'OFF'
      }
    },
    setup(props: Props, context: SetupContext) {
      //親へクリックイベントを伝播
      const clickSwitch = () => {
        context.emit('click-switch');
      };

      //伝播
      return {clickSwitch};
    }
  })
</script>

<style lang="scss" scoped>
  .toggleSwitchWrapper{
    appearance: none;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: #fafafa;
    color: #212121;
    border: 0;
    box-shadow: 0 0 0 2px #212121;
    border-radius: 30px;
    width: 70px;
    height: 30px;
    padding: 0 10px;
    cursor: pointer;
    transition: background-color, color .2s ease-out;
  }
  .toggleSwitchText{
    width: 100%;
    text-align: right;
  }
  .toggleSwitchCircle{
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    background-color: #fafafa;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5);
    transition: left .2s ease-out;
  }
  .toggleSwitchWrapperEnable{
    background-color: #607D8B;
    color: #fafafa;
  }
  .toggleSwitchTextEnable{
    text-align: left;
  }
  .toggleSwitchCircleEnable{
    left: 40px;
  }
</style>
