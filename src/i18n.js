import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
import { register } from 'timeago.js';
import ta_de from 'timeago.js/esm/lang/de';
import ta_es from 'timeago.js/esm/lang/es';
import ta_ko from 'timeago.js/esm/lang/ko';
import ta_ru from 'timeago.js/esm/lang/ru';
import ta_pt_BR from 'timeago.js/esm/lang/pt_BR';
import ta_tr from 'timeago.js/esm/lang/tr';
import ta_uk from 'timeago.js/esm/lang/uk';

register('de', ta_de);
register('es', ta_es);
register('ko', ta_ko);
register('ru', ta_ru);
register('pt_BR', ta_pt_BR);
register('tr', ta_tr);
register('uk', ta_uk);

import en from './lang/en.json';
import es from './lang/es.json';
import ko from './lang/ko.json';
import de from './lang/de.json';
import ru from './lang/ru.json';
import pt_BR from './lang/pt_BR.json';
import tr from './lang/tr.json';
import uk from './lang/uk.json';

addMessages('en', en);
addMessages('es', es);
addMessages('ko', ko);
addMessages('de', de);
addMessages('ru', ru);
addMessages('pt_BR', pt_BR);
addMessages('tr', tr);
addMessages('uk', uk);

init({
  fallbackLocale: 'en',
  initialLocale:
    window.localStorage.getItem('locale') || getLocaleFromNavigator(),
});
