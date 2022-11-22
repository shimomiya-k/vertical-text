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
const timeout = ref("");

setTimeout(() => {
  timeout.value =
    "読み込み時間が長い場合は、アプリを再起動するか、文字数を減らして再度お試しください。";
}, 5000);

// computed
const text = computed(() => {
  return store.state.text;
});
const textIdol = computed(() => {
  const reg = /<h3 id="chapter\-\d+">/g;
  const temp = store.state.text.replaceAll(reg, "<h3>");
  return temp;
});
const currentPage = computed(() => {
  return store.state.currentPage;
});
const pageSize = computed(() => {
  console.log(`pageSize: ${store.state.pageSize}`);
  return store.state.pageSize;
});
const fontScale = computed(() => {
  return store.state.fontScale;
});
const isVertical = computed(() => {
  return store.state.isVertical;
});
const isProgress = computed(() => {
  const isEmpty = store.state.text.length === 0;
  if (store.state.isVertical) {
    const minSize = store.state.pageSize <= 1;
    return isEmpty && minSize;
  }

  return isEmpty;
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
  try {
    // @ts-ignore
    window.flutter_inappwebview.callHandler("changedPage", page);
  } catch {}
  // @ts-ignore
}

function onChangeFontScale(scale: number) {
  store.dispatch("changeFontScale", scale);
}

function onChangePageSize(size: number) {
  store.dispatch("changePageSize", size);
  try {
    // @ts-ignore
    window.flutter_inappwebview.callHandler("changedPageSize", size);
  } catch {}
}

function onChangeIsVertical(isVertical: boolean) {
  store.dispatch("changeIsVertical", isVertical);
}

function onChangeShowPageNum(showPageNum: boolean) {
  store.dispatch("changeShowPageNum", showPageNum);
}

function onChangeScrollHeight(scrollHeight: number) {
  store.dispatch("changeScrollHeight", scrollHeight);
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

(window as any).moveToChapter = (chapter: string) => {
  const rect = document.getElementById(chapter)?.getBoundingClientRect();
  if (!rect) return;
  const index = Math.round(rect.top / store.state.scrollHeight);
  onChangePage(store.state.currentPage + index);
};
</script>

<template>
  <div id="app">
    <div v-if="isProgress" class="absolute top-0 right-0 left-0 bottom-0">
      <div class="flex flex-col items-center justify-center h-full">
        <div
          class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"
        ></div>
        <p class="pt-10 px-10 text-xs">{{ timeout }}</p>
      </div>
    </div>

    <Page
      :text="text"
      :text-idol="textIdol"
      :font-scale="fontScale"
      :page-width="pageWidth"
      :page-height="pageHeight"
      :current-page="currentPage"
      :page-size="pageSize"
      :on-change-page="onChangePage"
      :on-change-page-size="onChangePageSize"
      :on-change-scroll-height="onChangeScrollHeight"
      v-if="isVertical"
    />

    <div
      class="text-box"
      v-else-if="!isVertical"
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

  margin: 0em 1em 5em 1em;
  line-height: 2;
  letter-spacing: 0.03em;
  overflow-wrap: break-word;
}
</style>
