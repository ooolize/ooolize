import cn from "./cn";
import en from "./en";
import ja from "./ja";

import { createI18n } from "vue-i18n";

const i18n = createI18n({
  locale: "en", // 默认语言
  fallbackLocale: "en", // set fallback locale
  messages: {
    en,
    cn,
    ja,
  },
});

export default i18n;
