import { ref } from "vue";

export const isDark = ref(true);
export const changeStatus = () => {
  console.log(isDark.value);
  // 切换类名
  let body = document.body;

  if (body.classList.contains("theme-dark")) {
    body.classList.remove("theme-dark");
    body.classList.add("theme-light");
  } else {
    body.classList.remove("theme-light");
    body.classList.add("theme-dark");
  }

  isDark.value = !isDark.value;
};
