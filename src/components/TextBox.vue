<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { nextTick, onMounted, onUpdated } from "vue";

// props
interface Props {
  text: string;
  width: number;
  height: number;
  position: number;
  onChangePageSize?: (pageSize: number) => void;
}
const props = defineProps<Props>();

// data
const pageSize = ref(1);
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
      class="text-box__inner"
      :style="{
        width: `${width}px`,
        height: `${height}px`,
        'column-width': height + 'px',
        transform: `translateY(${-scrollHeight * position}px)`,
      }"
      ref="htmlRef"
    >
      <div class="text-box__html" v-html="text"></div>
      <div class="text-box__html" v-html="text"></div>
      <div class="text-box__last-daemon" ref="lastDaemon"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-box {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 14px;

  &__inner {
    // font-family: 'NotoSerifJP';
    writing-mode: vertical-rl;
    text-orientation: upright;
    line-break: strict;
    padding: 2em 1em;
    line-height: 2;
    letter-spacing: 0.03em;
    column-gap: 2em;
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
</style>
