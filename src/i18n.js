import { addMessages, init, getLocaleFromNavigator, locale } from 'svelte-i18n';
import moment from 'moment';
import 'moment/locale/es';

import en from './lang/en.json';
import es from './lang/es.json';

locale.subscribe(l => {
  if (l) moment.locale(l);
});

addMessages('en', en);
addMessages('es', es);

init({
  fallbackLocale: 'en',
  initialLocale:
    window.localStorage.getItem('locale') || getLocaleFromNavigator(),
});
