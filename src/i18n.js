import { addMessages, init, getLocaleFromNavigator, locale } from 'svelte-i18n';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/ko';
import 'moment/locale/de';
import 'moment/locale/ru';

import en from './lang/en.json';
import es from './lang/es.json';
import ko from './lang/ko.json';
import de from './lang/de.json';
import de from './lang/ru.json';

locale.subscribe((l) => {
  if (l) moment.locale(l);
});

addMessages('en', en);
addMessages('es', es);
addMessages('ko', ko);
addMessages('de', de);
addMessages('ru', ru);

init({
  fallbackLocale: 'en',
  initialLocale:
    window.localStorage.getItem('locale') || getLocaleFromNavigator(),
});
