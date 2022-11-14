// store.ts
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

// ストアのステートに対して型を定義します
export interface State {
  text: string;
  currentPage: number;
  pageSize: number;
  fontScale: number;
  isVertical: boolean;
}

// インジェクションキーを定義します
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    text: "",
    currentPage: 0,
    pageSize: 1,
    fontScale: 0.8,
    isVertical: true,
  },
  mutations: {
    setText(state, payload) {
      state.text = payload.text;
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
  },
  actions: {
    loadText(context, filename) {
      if (filename !== "sample") {
        context.commit({ type: "setText", text: filename });
        return;
      }

      fetch(`${filename}.txt`)
        .then((resp) => resp.text())
        .then((text) => {
          context.commit({ type: "setText", text });
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
  },
});
