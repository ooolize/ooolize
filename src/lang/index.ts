import cn from './cn'
import en from './en'
import ja from './ja'

import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'en', // 默认语言
    messages: {
        cn: cn,
        en: en,
        ja: ja
    },
})

export default i18n