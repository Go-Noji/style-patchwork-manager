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
  </section>
</template>

<script lang="ts">
  import {computed, createComponent, ref, SetupContext} from "@vue/composition-api";
  import AppLocalizationText from "@/options/components/AppLocalizationText.vue";
  import {COLORS} from "@/settings/settings";
  import {isColorKeys} from "@/settings/interface";

  type Props = {
    index: number,
    title: string,
    url: string,
    color: string,
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
      color: {
        type: String,
        required: true
      },
    },
    setup(props: Props, setupContext: SetupContext) {
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
       * 削除イベントを親に emit する
       */
      const deletePreset = () => {
        setupContext.emit('delete-preset', props.index);
      };

      /**
       * COLORS のキー名から実際のカラーコードを取得する
       */
      const colorCode = computed(() => {
        return isColorKeys(props.color) ? COLORS[props.color] : '#9E9E9E';
      });

      //prop を伝播
      return {isHover, hoverEnter, hoverLeave, deletePreset, colorCode};
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
