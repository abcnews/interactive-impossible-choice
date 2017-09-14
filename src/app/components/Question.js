const yo = require('yo-yo');
require('./Question.scss');

const sum = (a, b) => a + b;

const Question = (state, send) => {
	state.publicGuessesTotal = state.publicGuesses.reduce(sum, 0);

	state.publicGuessPercentages = state.publicGuesses.map(value => {
		return Math.round(value / state.publicGuessesTotal * 100);
	});

  return yo`<div class="Question${state.isMock ? ' Question--mock' : ''}">
  	<div class="QuestionLabel">${state.label || 'Question'}</div>
  	<div class="h1">${state.statement}</div>
  	${QuestionPersonalChoices(state, send)}
		${state.guess !== null ? [
  		yo`<div class="h2">What does everybody else think?</div>`,
  		QuestionPublicResult(state),
  		QuestionPublicChoices(state),
  		yo`<div class="QuestionPublicResponses">from ${state.publicGuessesTotal} responses</div>`,
			(state.response && state.response.length ? QuestionExpert(state) : null)
		] : null}
  </div>`;
};

const QuestionPersonalChoices = (state, send) => {
	return yo`<div class="QuestionPersonalChoices">
		${state.choices.map((choice, index) => {
			let className = 'Button';

			if (state.guess !== null) {
				className += ' Button--disabled';
			}

			if (state.guess === index) {
				className += ' Button--selected';
			}

			return yo`<div class="QuestionPersonalChoices-choice">
				<div class="${className}" onclick=${send.event('guess', {question: state.id, guess: index})}>${choice}</div>
			</div>`;
		})}
	</div>`;
};

const QuestionPublicResult = state => {
	return yo`<div class="QuestionPublicResult">
		${state.publicGuessPercentages[state.guess]}% of respondents agree with you so far.
	</div>`;
};

const QuestionPublicChoices = state => {
	return yo`<div class="QuestionPublicChoices">
		${state.choices.map((choice, index) => {
			let className = 'QuestionPublicChoices-choice';

			if (state.guess === index) {
				className += ' QuestionPublicChoices-choice--selected';
			}

			return yo`<div class="${className}">
				<div class="QuestionPublicChoices-choicePct">${state.publicGuessPercentages[index]}%</div>
				<div class="QuestionPublicChoices-choiceText">${choice}</div>
				<div class="QuestionPublicChoices-choiceTrack"><div style="width: ${state.publicGuessPercentages[index]}%;" class="QuestionPublicChoices-choiceBar"></div></div>
			</div>`;
		})}
	</div>`;
};

const QuestionExpert = state => {
	return yo`<div class="QuestionExpert">
		<div class="QuestionExpert-response u-richtext">
			${state.response}
		</div>
		${typeof state.source !== 'object' ? null : yo`<div class="QuestionExpert-source">Source:
			${state.source.url ? yo`<a href="${state.source.url}">${state.source.name}</a>` : state.source.name}
		</div>`}
	</div>`;
};

module.exports = Question;

const MOCK_DATA = {
	isMock: true,
	id: 'mock',
	label: ' ',
	statement: '▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆​▆▆▆▆▆▆▆▆▆▆▆▆',
	choices: [' ', ' '],
	guess: null,
	publicGuesses: [0, 0]
};

const MOCK_SEND = () => {};
MOCK_SEND.event = MOCK_SEND;

const MockQuestion = () => Question(MOCK_DATA, MOCK_SEND);

module.exports.MockQuestion = MockQuestion;
