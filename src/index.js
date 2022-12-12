import { Client } from "@abcnews/poll-counters-client";
import { getMountValue, selectMounts } from "@abcnews/mount-utils";
import "./keyframes.scss";
import app from "./app";
import "./app/components/Button.scss";
import { MockQuestion } from "./app/components/Question";
import { whenOdysseyLoaded } from "@abcnews/env-utils";

const PROJECT_ID = "interactive-impossible-choice";

const mock = (questionsEls) => {
  questionsEls.forEach((el) => {
    el.appendChild(MockQuestion());
  });
};

const init = (config, questionsEls) => {
  if (typeof config.dbDump !== "object") {
    config.pollCountersClient = new Client(`${PROJECT_ID}__${config.id}`);
  }

  app(config, (err, views) => {
    if (err) {
      throw err;
    }

    questionsEls.forEach((questionEl) => {
      const mockEl = questionEl.firstChild;
      const [, id] = getMountValue(questionEl).split(":");
      const question = config.questions.find((question) => question.id === id);

      questionEl.removeChild(mockEl);

      if (question == null) {
        return;
      }

      questionEl.appendChild(views[id]);
    });
  });
};

whenOdysseyLoaded.then(() => {
  const config = window.__IMPOSSIBLE_CHOICE_CONFIG__;
  const questionsEls = selectMounts("question");

  questionsEls.forEach((el) => el.classList.add("u-pull-out"));

  mock(questionsEls);

  questionsEls.forEach((questionEl) => {
    const [, id] = getMountValue(questionEl).split(":");
    const question = config.questions.find((question) => question.id === id);

    if (question == null) {
      return;
    }

    question.response = [];

    let nextEl = questionEl.nextElementSibling;

    while (nextEl != null && !nextEl.matches("h2,[data-mount]")) {
      nextEl.classList.add("is-part-of-response");
      question.response.push(nextEl);
      nextEl = nextEl.nextElementSibling;
    }
  });

  init(config, questionsEls);
});
