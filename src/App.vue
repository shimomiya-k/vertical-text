<script setup lang="ts">
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

const _calcSize = calcSize.bind(this);

onMounted(() => {
  store.dispatch("loadText", "sample");
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

function onChangePage(page: number) {
  store.dispatch("changeCurrentPage", page);
  // @ts-ignore
  (changedPage as any).postMessage(page);
}

function onChangePageSize(size: number) {
  store.dispatch("changePageSize", size);
  // @ts-ignore
  (changedPageSize as any).postMessage(size);
}

(window as any).loadText = (text: string) => {
  store.dispatch("loadText", text);
};

(window as any).changeCurrentPage = (page: number) => {
  onChangePage(page);
};
</script>

<template>
  <div id="app">
    <Page
      :text="text"
      :page-width="pageWidth"
      :page-height="pageHeight"
      :current-page="currentPage"
      :page-size="pageSize"
      :on-change-page="onChangePage"
      :on-change-page-size="onChangePageSize"
    />
  </div>
</template>

<style scoped>
html,
body {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic Pro",
    Meiryo, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
