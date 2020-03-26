<template>
  <section
    :style="'border-left: 5px solid '+colorCode"
    :class="{hoverShadow: isHover}"
    class="presetListItemWrapper"
  >
    <div class="presetListItemDeleteButtonWrapper">
      <button
        class="presetListItemDeleteButton"
        @click="deletePreset"
        @mouseenter="hoverEnter"
        @mouseleave="hoverLeave"
      ><img
        svg-inline
        class="presetListItemDeleteButtonImage"
        src="@/assets/cancel.svg"
      ></button>
    </div>
    <div class="presetListItemTitleWrapper">
      <router-link
        :to="'/edit/'+String(index)"
        class="presetListItemEditLink"
      >
        <h2 class="presetListItemTitle">{{title}}</h2>
      </router-link>
      <p v-if="url === ''">
        <AppLocalizationText msg="msg_apply_all_sites"></AppLocalizationText>
      </p>
      <p v-else>
        <a
          :href="url"
          target="_blank"
        >
          <span>{{url}}</span>
          <img
            svg-inline
            class="presetListItemLinkIcon"
            src="@/assets/link.svg"
            alt="setting"
          >
        </a>
      </p>
    </div>
    <AppModal
      v-show="deleteModalFlag"
      @click-outer="deleteModalFlag = false"
    >
      <AppModalDeleteWindow
        @click-delete="deletePreset"
        @click-back="deleteModalFlag = false"
      >
        <p><AppLocalizationText msg="msg_delete_attention"></AppLocalizationText></p>
      </AppModalDeleteWindow>
    </AppModal>
  </section>
</template>

<script lang="ts">
  import {computed, createComponent, inject, ref, SetupContext} from "@vue/composition-api";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import AppModal from "@/options/components/AppModal.vue";
  import AppModalDeleteWindow from "@/options/components/AppModalDeleteWindow.vue";
  import {COLORS} from "@/settings/settings";
  import {isColorKeys} from "@/settings/interface";
  import {USE_SETTING} from "@/options/compositions/settingComposition";

  type Props = {
    index: number,
    title: string,
    url: string,
    color: string,
  };

  export default createComponent({
    components: {AppLocalizationText, AppModal, AppModalDeleteWindow},
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
      color: {
        type: String,
        required: true
      },
    },
    setup(props: Props, setupContext: SetupContext) {
      //削除ボタンにホバーしているかどうか
      const isHover = ref(false);

      //削除モーダルの表示フラグ
      const deleteModalFlag = ref(false);

      //設定用の composition function を用意
      const setting = inject(USE_SETTING);

      //composition function の絞り込み
      if (setting === undefined) {
        return;
      }

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
       * 削除イベントを親に emit する
       */
      const deletePreset = () => {
        //削除モーダルが表示されておらず、かつ確認フラグが true ならモーダルを表示して終了
        if ( ! deleteModalFlag.value && setting.state.deleteConfirm) {
          deleteModalFlag.value = true;
          return;
        }

        //モーダルが表示されていたら非表示にする
        deleteModalFlag.value = false;

        //削除実行
        setupContext.emit('delete-preset', props.index);
      };

      /**
       * COLORS のキー名から実際のカラーコードを取得する
       */
      const colorCode = computed(() => {
        return isColorKeys(props.color) ? COLORS[props.color] : '#9E9E9E';
      });

      //prop を伝播
      return {isHover, deleteModalFlag, hoverEnter, hoverLeave, deletePreset, colorCode};
    }
  });
</script>

<style lang="scss" scoped>
  .presetListItemWrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .presetListItemTitleWrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
  }
  .presetListItemEditLink{
    max-width: 80%;
    flex-grow: 1;
  }
  .presetListItemTitle{
    font-size: 18px;
  }
  .presetListItemLinkIcon{
    width: 16px;
    margin: 0 10px;
  }
  .presetListItemDeleteButtonWrapper{
    width: 60px;
    flex-shrink: 1;
  }
  .presetListItemDeleteButton{
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    padding: 15px;
  }
  .presetListItemDeleteButtonImage{
    width: 20px;
    color: #fafafa;
  }
</style>
