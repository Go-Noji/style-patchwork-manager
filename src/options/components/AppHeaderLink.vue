<template>
  <div class="headerLinkWrapper inner">
    <router-link
      v-if="to !== ''"
      class="headerTitle"
      :to="to"
    ><slot></slot></router-link>
    <h1
      v-else
      class="headerTitle"
    ><slot></slot></h1>
    <div class="headerLinkUnderBarWrapper">
      <span
        :class="{headerLinkUnderBarCurrent: current}"
        :style="'background-color:'+color"
        class="headerLinkUnderBar"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
  import {createComponent, ref, onMounted, watch} from "@vue/composition-api";

  type Props = {
    to: string,
    color: string
  };

  export default createComponent({
    props: {
      to: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
    },
    setup(props: Props) {
      //現在表示中のリンクか判定
      const current = ref(false);

      //下線をアニメーションさせる
      const animation = () => {
        //一旦カレント指定を解除
        current.value = false;

        //カレントか判定
        setTimeout(() => {
          current.value = props.to === ''
        }, 100);
      };

      //表示中のリンクかの判定は 0.1 秒待ってから行う
      onMounted(animation);

      //props.color の変更を検知しアニメーションを実行する
      watch(() => props.color, animation);

      //伝播
      return {current};
    }
  });
</script>

<style scoped lang="scss">
  .headerTitle{
    display: block;
    font-size: 18px;
    font-weight: 700;
    margin: 0;
  }
  .headerLinkWrapper{
    position: relative;
    box-sizing: border-box;
    height: 92px;
  }
  .headerLinkUnderBarWrapper{
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
  }
  .headerLinkUnderBar{
    transition: width .2s ease-out;
    display: block;
    width: 0%;
    height: 5px;
  }
  .headerLinkUnderBarCurrent{
    width: 100%;
  }
</style>
