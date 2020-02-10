<template>
  <span :class="{blockSpan: typeof message !== 'string'}">
  <template v-if="typeof message === 'string'">{{message}}</template>
  <template v-else>
    <span
      v-for="(text, index) in message"
      class="blockSpan"
      :key="msg+'_'+index"
    >{{text}}</span>
  </template>
  </span>
</template>

<script lang="ts">
  import {computed, createComponent, onMounted, ref} from "@vue/composition-api";

  type Prop = {msg: string, raw?: boolean};

  export default createComponent({
    props: {
      msg: {
        type: String,
        required: true
      },
      raw: {
        type: Boolean,
        required: false
      }
    },
    setup(props: Prop) {
      //描画するメッセージ
      //改行があった場合は配列になる
      const message = ref<string|Array<string>>("");

      onMounted(() => {
        //翻訳メッセージを入手
        const _message = chrome.i18n.getMessage(props.msg);

        //翻訳メッセージが存在しなかったら何もしない
        if (_message === '' || _message === undefined) {
          return;
        }

        //メッセージに"\n"が存在したら 配列にする
        message.value = _message.indexOf("\n") === -1
          ? _message
          : _message.split("\n");
      });

      //伝播
      return {message};
    }
  })
</script>

<style scoped>
  .blockSpan{
    display: block;
  }
</style>
