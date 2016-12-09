/*!
 * interactive-impossible-choice
 *
 * @version development
 * @author Colin Gourlay <gourlay.colin@abc.net.au>
 */

// Becasue Phase 2's require.js interferes with UMD module imports
if (typeof define === 'function' && define.amd) {
	define._amd = define.amd;
	delete define.amd;
}

const fastclick = require('fastclick');

if (typeof define === 'function' && define._amd) {
	define.amd = define._amd;
	delete define._amd;
}

const firebase  = require('firebase/app');
                  require('firebase/database');
const ns        = require('util-news-selectors');
const app       = require('./app');

const PROJECT_ID = 'interactive-impossible-choice';
const HTML_FRAGMENT_SELECTOR = ns('embed:fragment');
const FIREBASE_APP_CONFIG = {
  apiKey: 'AIzaSyDZHVgCwT8UgeMwByM96Qr-grqbwf3QzeM',
  authDomain: 'impossible-choice.firebaseapp.com',
  databaseURL: 'https://impossible-choice.firebaseio.com',
  storageBucket: 'impossible-choice.appspot.com'
};

const init = (config, $$questions) => {
  if (typeof config.dbDump !== 'object') {
    firebase.initializeApp(FIREBASE_APP_CONFIG);
    config.database = firebase.database();
  }

  app(config, (err, views) => {
    if (err) { throw err; }

    $$questions.each((index, el) => {
      const $question = $(el);
      const id = $question.data(dataAttr('question'));
      const question = config.questions.filter(question => question.id === id)[0];

      if (question == null) {
        return;
      }

      $question.append(views.questions[id]);
    });
  });

  const $title = $('h1');
  const titleParts = $title.html().split(': ');

  if (titleParts.length === 2) {
    $title.html(`<div class="Series">${titleParts[0]}:</div>${titleParts[1]}`);
  }
};

const dataAttr = key => `${PROJECT_ID}-${key}`;

const dataAttrSelector = key => `[data-${dataAttr(key)}]`;

const getByKey = key => {
  const $els = $(dataAttrSelector(key));

  if (!$els.length) {
    throw `"${key}" not found`;
  }

  return $els;
};

const unwrapped = ($el, _el) => {
  const is$Map = (typeof $el === 'number');

  $el = is$Map ? $(_el) : $el;

  $el.unwrap();

  // If last element we unwrapped was just the preview site's
  // <span id="CTX-\d+"> wrapper, we need to unwrap again.
  if ($el.parent().is(HTML_FRAGMENT_SELECTOR)) {
    $el.unwrap();
  }

  return is$Map ? $el.get() : $el;
};

$(() => {
  const $$questions = getByKey('question').map(unwrapped);
  const configURL = getByKey('config').first().data(dataAttr('config'));
  const fetches = [$.Deferred(), $.Deferred()];

  $.getJSON(configURL).done((config) => {
    fetches[0].resolve(config);
  });

  try {
    const dbDumpURL = getByKey('db-dump').first().data(dataAttr('db-dump'));
    $.getJSON(dbDumpURL).done((dbDump) => {
      fetches[1].resolve(dbDump);
    });
  } catch (e) {
    fetches[1].resolve();
  }


  $.when(fetches[0], fetches[1]).done((config, dbDump) => {
    config.dbDump = dbDump;
    init(config, $$questions);
  });

  fastclick(document.body);
});
