<template>
  <section>
    <a>
      <h2>{{title}}</h2>
      <p
        v-if="url === ''"
      ><AppLocalizationText msg="msg_apply_all_sites"></AppLocalizationText></p>
      <p
        v-else
      >URL: <span>{{url}}</span></p>
    </a>
    <p
      v-if="url !== ''"
    ><a
      :href="url"
      target="_blank"
    ><AppLocalizationText msg="msg_to_destination_site"></AppLocalizationText><img
      svg-inline
      class="linkIcon"
      src="@/assets/link.svg"
      alt="setting"
    ></a></p>
    <p><router-link :to="'/edit/'+String(index)"><AppLocalizationText msg="msg_edit"></AppLocalizationText></router-link></p>
    <p><button @click="deletePreset"><AppLocalizationText msg="msg_delete"></AppLocalizationText></button></p>
  </section>
</template>

<script lang="ts">
  import {createComponent, SetupContext} from "@vue/composition-api";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";

  type Props = {
    index: number,
    title: string,
    url: string
  };

  export default createComponent({
    components: {AppLocalizationText},
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
      /**
       * 削除イベントを親に emit する
       */
      const deletePreset = () => {
        setupContext.emit('delete-preset', props.index);
      };

      //prop を伝播
      return {deletePreset};
    }
  });
</script>

<style scoped>
  .linkIcon{
    width: 16px;
    margin: 0 10px;
  }
</style>
