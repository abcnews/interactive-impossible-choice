/*!
 * interactive-impossible-choice
 *
 * @version development
 * @author Colin Gourlay <gourlay.colin@abc.net.au>
 */

const { Client } = require('@abcnews/poll-counters-client');
const ns = require('util-news-selectors');
require('./keyframes.scss');
const app = require('./app');
require('./app/components/Button.scss');
const { MockQuestion } = require('./app/components/Question');

const PROJECT_ID = 'interactive-impossible-choice';
const HTML_FRAGMENT_SELECTOR = ns('embed:fragment');

const mock = $$questions => {
  $$questions.each((index, el) => {
    $(el).append(MockQuestion());
  });
};

const init = (config, $$questions) => {
  if (typeof config.dbDump !== 'object') {
    config.pollCountersClient = new Client(`${PROJECT_ID}__${config.id}`);
  }

  app(config, (err, views) => {
    if (err) {
      throw err;
    }

    $$questions.each((index, el) => {
      const $question = $(el);
      const $mock = $question.children().first();
      const id = $question.data(dataAttr('question'));
      const question = config.questions.filter(question => question.id === id)[0];

      if (question == null) {
        $mock.remove();
        return;
      }

      $mock.replaceWith(views[id]);
    });
  });
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
  const is$Map = typeof $el === 'number';

  $el = is$Map ? $(_el) : $el;

  $el.unwrap();

  // If last element we unwrapped was just the preview site's
  // <span id="CTX-\d+"> wrapper, we need to unwrap again.
  if ($el.parent().is(HTML_FRAGMENT_SELECTOR)) {
    $el.unwrap();
  }

  return is$Map ? $el.get() : $el;
};

const $$questions = getByKey('question')
  .map(unwrapped)
  .addClass('u-pull-out');
const configURL = getByKey('config')
  .first()
  .data(dataAttr('config'));
const fetches = [$.Deferred(), $.Deferred()];
const odyssey = $.Deferred();

$.getJSON(configURL).done(config => {
  fetches[0].resolve(config);
});

try {
  const dbDumpURL = getByKey('db-dump')
    .first()
    .data(dataAttr('db-dump'));
  $.getJSON(dbDumpURL).done(dbDump => {
    fetches[1].resolve(dbDump);
  });
} catch (e) {
  fetches[1].resolve();
}

if (window.__ODYSSEY__) {
  odyssey.resolve();
} else {
  window.addEventListener('odyssey:api', () => {
    odyssey.resolve();
  });
}

mock($$questions);

$.when(fetches[0], fetches[1], odyssey).done((config, dbDump) => {
  config.dbDump = dbDump;

  $$questions.each((index, el) => {
    const $question = $(el);
    const id = $question.data(dataAttr('question'));
    const question = config.questions.filter(question => question.id === id)[0];

    if (question == null) {
      return;
    }

    question.response = [];

    let $next = $question.next();

    while ($next.length && !$next.is('h2,a[name="endresponse"]')) {
      question.response.push($next.addClass('is-part-of-response').get(0));
      $next = $next.next();
    }
  });

  init(config, $$questions);
});
