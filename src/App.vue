<script setup lang="ts">
import type {} from "css-font-loading-module";
import { computed, ref } from "@vue/reactivity";
import { onBeforeUnmount, onMounted } from "vue";
import { useStore } from "vuex";
import Page from "./components/Page.vue";
import { key } from "./store";

const store = useStore(key);
// data
const pageWidth = ref(0);
const pageHeight = ref(0);

// computed
const text = computed(() => {
  return store.state.text;
});
const currentPage = computed(() => {
  return store.state.currentPage;
});
const pageSize = computed(() => {
  return store.state.pageSize;
});
const fontScale = computed(() => {
  return store.state.fontScale;
});
const isVertical = computed(() => {
  return store.state.isVertical;
});

const _calcSize = calcSize.bind(this);

onMounted(() => {
  window.addEventListener("resize", _calcSize);
  calcSize();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", _calcSize);
});

function calcSize() {
  pageWidth.value = window.innerWidth;
  pageHeight.value = window.innerHeight;
}

function onChangeTitle(title: string) {
  store.dispatch("changeTitle", title);
}

function onChangeAuthor(author: string) {
  store.dispatch("changeAuthor", author);
}

function onChangePage(page: number) {
  store.dispatch("changeCurrentPage", page);
  // @ts-ignore
  window.flutter_inappwebview.callHandler("changedPage", page);
}

function onChangeFontScale(scale: number) {
  store.dispatch("changeFontScale", scale);
}

function onChangePageSize(size: number) {
  store.dispatch("changePageSize", size);
  // @ts-ignore
  window.flutter_inappwebview.callHandler("changedPageSize", size);
}

function onChangeIsVertical(isVertical: boolean) {
  store.dispatch("changeIsVertical", isVertical);
}

function onChangeShowPageNum(showPageNum: boolean) {
  store.dispatch("changeShowPageNum", showPageNum);
}

(window as any).loadText = (text: string) => {
  store.dispatch("loadText", text);
};

(window as any).changeTitle = (title: string) => {
  onChangeTitle(title);
};

(window as any).changeAuthor = (author: string) => {
  onChangeAuthor(author);
};

(window as any).changeCurrentPage = (page: number) => {
  onChangePage(page);
};

(window as any).changeFontScale = (scale: number) => {
  onChangeFontScale(scale);
};

(window as any).changeIsVertical = (isVertical: string) => {
  onChangeIsVertical(isVertical === "true");
};

(window as any).changeShowPageNum = (showPageNum: string) => {
  onChangeShowPageNum(showPageNum === "true");
};

(window as any).addColorStyle = (args: string) => {
  const { backgroundColor, textColor } = JSON.parse(args);
  if (!backgroundColor || !textColor) {
    return;
  }

  document.body.style.color = `#${textColor}`;
  document.body.style.backgroundColor = `#${backgroundColor}`;
};

(window as any).addFont = (args: string) => {
  const { fontFamily, fontData } = JSON.parse(args);

  if (!fontFamily || !fontData) {
    return;
  }

  var fontFace = new FontFace(`${fontFamily}`, `url(${fontData})`);

  fontFace
    .load()
    .then(function (loadedFace) {
      document.fonts.add(loadedFace);
      document.body.style.fontFamily = loadedFace.family;
    })
    .catch(function (e) {
      console.error("読み込み失敗...");
    });
};
</script>

<template>
  <div id="app">
    <Page
      :text="text"
      :font-scale="fontScale"
      :page-width="pageWidth"
      :page-height="pageHeight"
      :current-page="currentPage"
      :page-size="pageSize"
      :on-change-page="onChangePage"
      :on-change-page-size="onChangePageSize"
      v-if="isVertical"
    />

    <div
      class="text-box"
      v-else="isVertical"
      v-html="text"
      :style="{
        fontSize: `${fontScale * 18}pt`,
      }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
html,
body {
  width: 100%;
  height: 100%;
}

#app {
  width: 100vw;
  height: 100%;
}

.text-box {
  position: relative;

  margin: 0em 1em 0em 1em;
  line-height: 2;
  letter-spacing: 0.03em;
  overflow-wrap: break-word;
}
</style>
