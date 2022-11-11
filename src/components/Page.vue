<script setup lang="ts">
import { ref } from "vue";
import TextBox from "./TextBox.vue";

interface Props {
  currentPage: number;
  pageSize: number;
  text: string;
  fontScale: number;
  pageWidth: number;
  pageHeight: number;
  onChangePage: (currentPage: number) => void;
  onChangePageSize: (pageSize: number) => void;
}

const isTouching = ref(false);
const moveStartX = ref(0);
const containerRef = ref<HTMLDivElement>();

const props = defineProps<Props>();

function onTouchStart(e: TouchEvent) {
  e.preventDefault();
  isTouching.value = true;
  containerRef.value!.classList.add("is-stop");

  if (e.changedTouches) {
    moveStartX.value = e.changedTouches[0].pageX;
  }
}

function onTouchMove(e: TouchEvent) {
  if (!isTouching.value) {
    return;
  }

  const x = e.changedTouches[0].pageX;
  containerRef.value!.style.transform = `translateX(${
    -props.pageWidth + (x - moveStartX.value)
  }px)`;
}

function onTouchEnd(e: TouchEvent) {
  const x = e.changedTouches[0].pageX;
  const diffX = x - moveStartX.value;
  if (Math.abs(diffX) > props.pageWidth / 4) {
    // ページ送り
    if (diffX > 0 && props.currentPage < props.pageSize - 1) {
      props.onChangePage(props.currentPage + 1);
      containerRef.value!.style.transform = `translateX(${
        -props.pageWidth + diffX - props.pageWidth
      }px)`;
    } else if (diffX < 0 && props.currentPage > 0) {
      props.onChangePage(props.currentPage - 1);
      containerRef.value!.style.transform = `translateX(${
        -props.pageWidth + diffX + props.pageWidth
      }px)`;
    }
  }
  setTimeout(() => {
    containerRef.value!.classList.remove("is-stop");
    containerRef.value!.style.transform = `translateX(${-props.pageWidth}px)`;
    isTouching.value = false;
  }, 1);
}
</script>

<template>
  <div
    class="page"
    :style="{
      width: `${pageWidth}px`,
      height: `${pageHeight}px`,
    }"
  >
    <div
      class="page__container"
      :style="{
        transform: `translateX(${-pageWidth}px)`,
        width: `${pageWidth * 3}px`,
        height: `${pageHeight}px`,
      }"
      ref="containerRef"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <TextBox
        :text="text"
        :font-scale="fontScale"
        :width="pageWidth"
        :height="pageHeight"
        :position="currentPage + 1"
      ></TextBox>

      <TextBox
        :text="text"
        :font-scale="fontScale"
        :width="pageWidth"
        :height="pageHeight"
        :position="currentPage"
        :on-change-page-size="onChangePageSize"
      ></TextBox>

      <TextBox
        :text="text"
        :font-scale="fontScale"
        :width="pageWidth"
        :height="pageHeight"
        :position="currentPage - 1"
      ></TextBox>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  position: relative;
  overflow: hidden;

  &__container {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    display: flex;
    transition: transform 0.5s ease-out;

    &.is-stop {
      transition: none;
    }
  }
}
</style>
