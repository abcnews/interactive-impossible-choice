const yo = require('yo-yo');

const sum = (a, b) => a + b;

const view = (state, send) => {
	state.publicGuessesTotal = state.publicGuesses.reduce(sum, 0);

	state.publicGuessPercentages = state.publicGuesses.map(value => {
		return Math.round(value / state.publicGuessesTotal * 100);
	});

  return yo`<div class="Question${state.isMock ? ' Question--mock' : ''}">
  	<div class="QuestionLabel">${state.label || 'Question'}</div>
  	<div class="h1">${state.statement}</div>
  	${personalChoicesView(state, send)}
		${state.guess !== null ? [
  		yo`<div class="h2">What does everybody else think?</div>`,
  		publicResultView(state),
  		publicChoicesView(state),
  		yo`<div class="QuestionPublicResponses">from ${state.publicGuessesTotal} responses</div>`,
			(state.response && state.response.length ? expertView(state) : null)
		] : null}
  </div>`;
};

const personalChoicesView = (state, send) => {
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
				<div class="${className}" onclick=${send.event('guess', {question: state.id, guess: index})} }>${choice}</div>
			</div>`;
		})}
	</div>`;
};

const publicResultView = state => {
	return yo`<div class="QuestionPublicResult">
		${state.publicGuessPercentages[state.guess]}% of respondents agree with you so far.
	</div>`;
};

const publicChoicesView = state => {
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

const expertView = state => {
	return yo`<div class="QuestionExpert">
		<div class="QuestionExpert-response">
			${state.response}
		</div>
		${typeof state.source !== 'object' ? null : yo`<div class="QuestionExpert-source">Source:
			${state.source.url ? yo`<a href="${state.source.url}">${state.source.name}</a>` : state.source.name}
		</div>`}
	</div>`;
};

module.exports = view;

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

const mockView = () => {
	return view(MOCK_DATA, MOCK_SEND);
};

module.exports.mockView = mockView;
