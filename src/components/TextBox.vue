<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";
import { nextTick, onMounted, onUpdated } from "vue";
import { useStore } from "vuex";
import { key } from "../store";

// props
interface Props {
  text: string;
  width: number;
  height: number;
  fontScale: number;
  position: number;
  onChangePageSize?: (pageSize: number) => void;
}
const props = defineProps<Props>();

const store = useStore(key);

const author = computed(() => {
  return store.state.author;
});

const title = computed(() => {
  return store.state.title;
});

const showPageNum = computed(() => {
  return store.state.showPageNum;
});

// data
const pageSize = ref(0);
const scrollHeight = ref(1);
const htmlRef = ref<HTMLDivElement>();
const lastDaemon = ref<HTMLDivElement>();

// methods
function calcSize() {
  const rect1 = htmlRef.value!.getBoundingClientRect();
  const rect2 = lastDaemon.value!.getBoundingClientRect();
  const boxHeight = rect1.height;
  const itemHeight = rect2.height;
  const gapHeight = (boxHeight - itemHeight) / 2;
  const totalHeight = rect2.bottom - rect1.top;

  scrollHeight.value = itemHeight + gapHeight;
  pageSize.value = totalHeight / (itemHeight + gapHeight);

  if (props.onChangePageSize) {
    props.onChangePageSize(pageSize.value);
  }
}

onMounted(() => {
  nextTick(calcSize.bind(this));
});

onUpdated(() => {
  nextTick(calcSize.bind(this));
});
</script>

<template>
  <div
    class="text-box"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
  >
    <div
      class="title-box"
      :style="{
        fontSize: `${fontScale * 18 * 0.7}pt`,
      }"
    >
      {{ title }}
    </div>

    <div
      class="text-box__inner"
      :style="{
        width: `${width}px`,
        height: `${height}px`,
        'column-width': height + 'px',
        transform: `translateY(${-scrollHeight * position}px)`,
      }"
      ref="htmlRef"
    >
      <div
        class="text-box__html"
        :style="{
          fontSize: `${fontScale * 18}pt`,
        }"
        v-html="text"
      ></div>
      <div class="text-box__last-daemon" ref="lastDaemon"></div>
    </div>
    <div
      class="page-num-box"
      v-if="showPageNum"
      :style="{
        fontSize: `${fontScale * 18 * 0.7}pt`,
      }"
    >
      {{ props.position + 1 }}
    </div>
    <div
      class="author-box"
      :style="{
        fontSize: `${fontScale * 18 * 0.7}pt`,
      }"
    >
      {{ author }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
// @font-face {
//   font-family: "NotoSerifJP";
//   src: url("../assets/NotoSerifJP-Regular.woff2");
// }
.text-box {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &__inner {
    // font-family: "NotoSerifJP";
    writing-mode: vertical-rl;
    overflow-wrap: break-word;
    line-break: strict;
    padding: 3em 1em 3em 1em;
    line-height: 2;
    letter-spacing: 0.03em;
    column-gap: 3em;
    box-sizing: border-box;
  }

  &__html {
    -moz-user-select: none;
    user-select: none;
  }

  &__last-daemon {
    width: 1px;
    height: 100%;
  }
}

.title-box {
  position: absolute;
  margin: 0.5em 1.5em;
  height: 1.5em;
  left: 0;
  right: 0;
  top: 0;
  overflow: hidden;
}

.page-num-box {
  position: absolute;
  margin: 0.5em 1.5em;
  height: 1.5em;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.author-box {
  position: absolute;
  margin: 0.5em 1.5em;
  height: 1.5em;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: end;
  overflow: hidden;
}
</style>
