// store.ts
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

// ストアのステートに対して型を定義します
export interface State {
  text: string;
  title: string;
  author: string;
  currentPage: number;
  pageSize: number;
  fontScale: number;
  isVertical: boolean;
  showPageNum: boolean;
  scrollHeight: number;
  loading: boolean;
}

// インジェクションキーを定義します
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    text: "",
    title: "",
    author: "",
    currentPage: 0,
    pageSize: 0,
    fontScale: 0.8,
    isVertical: false,
    showPageNum: true,
    scrollHeight: 0.0,
    loading: false,
  },
  mutations: {
    setText(state, payload) {
      state.text = payload.text;
    },
    setTitle(state, payload) {
      state.title = payload.title;
    },
    setAuthor(state, payload) {
      state.author = payload.author;
    },
    setCurrentPage(state, payload) {
      state.currentPage = payload.currentPage;
    },
    setPageSize(state, payload) {
      state.pageSize = payload.pageSize;
    },
    setFontScale(state, payload) {
      state.fontScale = payload.fontScale;
    },
    setIsVertical(state, payload) {
      state.isVertical = payload.isVertical;
    },
    setShowPageNum(state, payload) {
      state.showPageNum = payload.showPageNum;
    },
    setScrollHeight(state, payload) {
      state.scrollHeight = payload.scrollHeight;
    },
    setLoading(state, payload) {
      state.loading = payload.loading;
    },
  },
  actions: {
    loadText(context, filename) {
      if (context.state.loading) {
        return;
      }

      context.commit({ type: "setLoading", loading: true });

      if (filename !== "sample") {
        context.commit({ type: "setText", text: filename });
        context.commit({ type: "setLoading", loading: false });
        return;
      }

      fetch(`${filename}.txt`)
        .then((resp) => resp.text())
        .then((text) => {
          context.commit({ type: "setText", text });
        })
        .finally(() => {
          context.commit({ type: "setLoading", loading: false });
        });
    },
    changeTitle(context, title) {
      context.commit({
        type: "setTitle",
        title,
      });
    },
    changeAuthor(context, author) {
      context.commit({
        type: "setAuthor",
        author,
      });
    },
    changeCurrentPage(context, currentPage) {
      context.commit({
        type: "setCurrentPage",
        currentPage,
      });
    },
    changePageSize(context, pageSize) {
      context.commit({
        type: "setPageSize",
        pageSize,
      });
    },
    changeFontScale(context, fontScale) {
      context.commit({
        type: "setFontScale",
        fontScale,
      });
    },
    changeIsVertical(context, isVertical) {
      context.commit({
        type: "setIsVertical",
        isVertical,
      });
    },
    changeShowPageNum(context, showPageNum) {
      context.commit({
        type: "setShowPageNum",
        showPageNum,
      });
    },
    changeScrollHeight(context, scrollHeight) {
      context.commit({
        type: "setScrollHeight",
        scrollHeight,
      });
    },
  },
});
