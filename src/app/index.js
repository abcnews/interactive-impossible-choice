import sendAction from "send-action";
import { update } from "yo-yo";
import Question from "./components/Question";

const questionsFromConfig = (config) =>
  config.questions.map((question) =>
    Object.assign({ guess: null, label: config.labels }, question)
  );

const app = (config, callback) => {
  const submitGuess = (question) => {
    if (config.pollCountersClient != null) {
      config.pollCountersClient.increment({
        question: question.id,
        answer: String(question.guess),
      });
    }
  };

  const create = (publicCounts) => {
    if (typeof publicCounts === "object") {
      config.questions.forEach((question) => {
        const publicGuesses = Array.isArray(publicCounts[question.id])
          ? question.choices.map(
              (_, index) => publicCounts[question.id][index] || 0
            )
          : question.choices.reduce((memo, _choice, index) => {
              memo[index] = 0;

              return memo;
            }, {});

        question.publicGuesses = Object.keys(publicGuesses).map(
          (choice_index) => {
            return publicGuesses[choice_index] || 0;
          }
        );
      });
    }

    const send = sendAction({
      onaction: (params, state) => {
        let question;

        if (params.question != null) {
          question = state.questions.find(
            (question) => question.id === params.question
          );
        }

        switch (params.type) {
          case "guess":
            if (question == null || question.guess !== null) {
              break;
            }
            question.guess = params.guess;

            if (question.publicGuesses) {
              question.publicGuesses[params.guess]++;
              submitGuess(question);
            }
            break;
          default:
            break;
        }

        return state;
      },
      onchange: (_params, state) => {
        requestAnimationFrame(() => {
          state.questions.forEach((questionState) => {
            update(views[questionState.id], Question(questionState, send));
          });
        });
      },
      state: {
        questions: questionsFromConfig(config),
      },
    });

    const views = send.state().questions.reduce((memo, questionState) => {
      memo[questionState.id] = Question(questionState, send);

      return memo;
    }, {});

    callback(null, views);
  };

  const localFallback = setTimeout(() => create(), 2000);

  if (config.dbDump != null && config.dbDump[config.id]) {
    clearTimeout(localFallback);
    create(config.dbDump[config.id]);
  } else if (config.pollCountersClient != null) {
    config.pollCountersClient.get((err, group) => {
      clearTimeout(localFallback);
      create(group ? group.value : generateInitialPublicCounts(config));
    });
  } else {
    console.error(
      new Error(
        "No database or dbDump provided, or config.id not present in either."
      )
    );
  }
};

export default app;

function generateInitialPublicCounts(config) {
  return config.questions.reduce((memo, question) => {
    memo[question.id] = question.choices.map(() => 0);

    return memo;
  }, {});
}
