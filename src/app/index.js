const raf = require('raf');
const sendAction = require('send-action');
const yo = require('yo-yo');
const Question = require('./components/Question');

const questionsFromConfig = config =>
  config.questions.map(question => Object.assign({ guess: null, label: config.labels }, question));

const app = (config, callback) => {
  const submitGuess = question => {
    config.database
      .ref(`${config.id}/${question.id}/${question.guess}`)
      .transaction(count => (typeof count !== 'number' ? 1 : count + 1));
  };

  const create = publicCounts => {
    config.questions.forEach(question => {
      const publicGuesses = Array.isArray(publicCounts[question.id])
        ? publicCounts[question.id]
        : question.choices.reduce((memo, choice, index) => {
            memo[index] = 0;

            return memo;
          }, {});

      question.publicGuesses = Object.keys(publicGuesses).map(choice_index => {
        return publicGuesses[choice_index] || 0;
      });
    });

    const send = sendAction({
      onaction: (params, state) => {
        let question;

        if (params.question != null) {
          question = state.questions.filter(question => question.id === params.question)[0];
        }

        switch (params.type) {
          case 'guess':
            if (question == null || question.guess !== null) {
              break;
            }
            question.guess = params.guess;
            question.publicGuesses[params.guess]++;
            submitGuess(question);
            break;
          default:
            break;
        }

        return state;
      },
      onchange: (params, state) => {
        raf(() => {
          state.questions.forEach(questionState => {
            yo.update(views[questionState.id], Question(questionState, send));
          });
        });
      },
      state: {
        questions: questionsFromConfig(config)
      }
    });

    const views = send.state().questions.reduce((memo, questionState) => {
      memo[questionState.id] = Question(questionState, send);

      return memo;
    }, {});

    callback(null, views);
  };

  if (config.dbDump != null && config.dbDump[config.id]) {
    create(config.dbDump[config.id]);
  } else if (config.database != null) {
    config.database
      .ref(config.id)
      .once('value')
      .then(snapshot => {
        create(snapshot.val());
      });
  } else {
    callback(new Error('No database or dbDump provided, or config.id not present in either.'));
  }
};

module.exports = app;
