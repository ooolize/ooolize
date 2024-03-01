import { ref } from "vue";

// 是否隐藏header
export const isShowHeader = ref(false);
export const hideHeader = () => {
    isShowHeader.value = false;
}
export const showHeader = () => {
    isShowHeader.value = true;
}
