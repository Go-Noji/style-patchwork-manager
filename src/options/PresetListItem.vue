<template>
  <section>
    <a>
      <h2>{{title}}</h2>
      <p
        v-if="url === ''"
      >全サイトに適用</p>
      <p
        v-else
      >URL: <span>{{url}}</span></p>
    </a>
    <p
      v-if="url !== ''"
    ><a
      :href="url"
      target="_blank"
    >設定先サイトへ</a></p>
    <p><router-link :to="'/edit/'+String(index)">編集</router-link></p>
    <p><button @click="deletePreset">削除</button></p>
  </section>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";

  type Props = {
    index: number,
    title: string,
    url: number
  };

  export default createComponent({
    props: {
      index: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
    },
    setup(props: Props, setupContext: SetupContext) {
      //削除イベントを親に emit する
      const deletePreset = () => {
        setupContext.emit('delete-preset', props.index);
      };

      //prop を伝播
      return {deletePreset};
    }
  });
</script>

<style scoped>

</style>
