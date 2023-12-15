import i18n from "@/locales";

export const changeLang = () => {
  if (i18n.global.locale === "cn") {
    i18n.global.locale = "en";
  } else if (i18n.global.locale === "en") {
    i18n.global.locale = "ja";
  } else if (i18n.global.locale === "ja") {
    i18n.global.locale = "cn";
  }
};
