(function () {
	var headEl, bodyEl, selectorEl, activeTemplateKey;

	var slice = Array.prototype.slice;

	var params = (function (str, objURL) {
    str.replace(/([^?=&]+)(=([^&]*))?/g, function ($0, $1, $2, $3) {
			objURL[$1] = $3;
		});

    return objURL;
	})(window.location.search, {});

	function createLinkEl(href) {
		var linkEl = document.createElement('link');

		linkEl.rel = 'stylesheet';
		linkEl.href = href;

		return linkEl;
	}

	function toggle(event) {
		var key = event.key != null ? event.key : event.keyCode;

		if (event.defaultPrevented) { return; }

		if (key === 'Alt' || key === 18) {
			selectorEl.classList[event.type === 'keydown' ? 'add' : 'remove']('is-active');
			event.preventDefault();
		}
	}

	function activate(key) {
		var template;

		if (key === activeTemplateKey) {
			return;
		}

		if (activeTemplateKey != null) {
			template = TEMPLATES[activeTemplateKey];

			template.stylesheets.forEach(function (linkEl) {
				headEl.removeChild(linkEl);
			});

			htmlEl.classList.remove(activeTemplateKey + '-active');

			Object.keys(template.classNames).forEach(function (classNamesKey) {
				var classNames = template.classNames[classNamesKey];
				var id = template.ids != null ? template.ids[classNamesKey] : null;

				slice.call(document.querySelectorAll('[template-' + classNamesKey +']')).forEach(function (el) {
					classNames.forEach(function (className) {
						el.classList.remove(className);
					});

					if (id != null) {
						el.removeAttribute('id');
					}
				});
			});
		}

		template = TEMPLATES[key];

		Object.keys(template.classNames).forEach(function (classNamesKey) {
			var classNames = template.classNames[classNamesKey];
			var id = template.ids != null ? template.ids[classNamesKey] : null;

			slice.call(document.querySelectorAll('[template-' + classNamesKey +']')).forEach(function (el) {
				classNames.forEach(function (className) {
					el.classList.add(className);
				});

				if (id != null) {
					el.setAttribute('id', id);
				}
			});
		});

		htmlEl.classList.add(key + '-active');

		template.stylesheets.forEach(function (linkEl) {
			headEl.appendChild(linkEl);
		});

		activeTemplateKey = key;
		localStorage.setItem('active-template-key', activeTemplateKey);
	}

	var TEMPLATES = {
		p1m: {
			label: 'Phase 1 Mobile',
			stylesheets: [
				createLinkEl('http://www.abc.net.au/res/sites/news/styles/min/abc.news.mobile.css')
			],
			classNames: {
				platform: ['platform-mobile'],
				a:        ['content'],
				b:        ['content'],
				c:        [],
				d:        [],
				story:    ['story', 'richtext'],
				embed:    ['embed-content'],
				fragment: ['embed-fragment'],
				wysiwyg:  ['embed-wysiwyg', 'richtext'],
				inner:    ['contents'],
				full:     [],
				left:     [],
				right:    []
			}
		},
		p1s: {
			label: 'Phase 1 Standard',
			stylesheets: [
				createLinkEl('http://www.abc.net.au/res/sites/news/styles/min/abc.news.css')
			],
			classNames: {
				platform: ['platform-standard'],
				a:        ['page_margins'],
				b:        ['page', 'section'],
				c:        ['subcolumns'],
				d:        ['c75l'],
				story:    ['article', 'section'],
				embed:    ['inline-content'],
				fragment: ['inline-content', 'html-fragment'],
				wysiwyg:  ['inline-content', 'wysiwyg'],
				inner:    ['inner'],
				full:     ['full'],
				left:     ['left'],
				right:    ['right']
			},
			ids: {
				a: 'main_content'
			}
		},
		p2: {
			label: 'Phase 2',
			stylesheets: [
				createLinkEl('http://www.abc.net.au/assets/news-1.7/css/core.css'),
				createLinkEl('http://www.abc.net.au/assets/news-1.7/css/screen.css')
			],
			classNames: {
				platform: ['platform-standard', 'platform-mobile'],
				a:        ['wcms-wrapper'],
				b:        ['main-content-container', 'container-fluid'],
				c:        ['article-detail-page', 'row'],
				d:        ['col-lg-9', 'col-md-8'],
				story:    ['article-text'],
				embed:    ['view-xyz'],
				fragment: ['view-html-fragment-embedded'],
				wysiwyg:  ['view-wysiwyg'],
				inner:    ['comp-xyz'],
				full:     ['comp-embedded-float-full'],
				left:     ['comp-embedded-float-left'],
				right:    ['comp-embedded-float-right']
			},
			ids: {
				b: 'main-content'
			}
		}
	}

	var MARKUP = '' +
		'<style>' +
			'[template-a] {' +
				'padding-top: 160px;' +
				'padding-bottom: 160px;' +
			'}' +
			'.TemplateSelector {' +
				'transform: translate(-50%, -102%);' +
				'transition: transform .125s;' +
				'position: fixed;' +
				'top: 0;' +
				'left: 50%;' +
				'z-index: 9999;' +
				'box-shadow: 0 0 0.25em rgba(0,0,0,0.5);' +
				'font-size: 14px;' +
				'font-family: sans-serif;' +
				'' +
			'}' +
			'.TemplateSelector.is-active {' +
				'transform: translate(-50%, 0);' +
			'}' +
			'.TemplateSelectorChoice {' +
				'display: block;' +
				'margin-top: -1px;' +
				'border: 1px solid #999;' +
				'border-radius: 0;' +
				'width: 12em;' +
				'background: #fff;' +
				'color: #000;' +
				'font-size: 100%;' +
				'line-height: 2;' +
				'cursor: pointer;' +
			'}' +
			'.TemplateSelectorChoice:last-child {' +
				'border-bottom-right-radius: 0.25em;' +
				'border-bottom-left-radius: 0.25em;' +
			'}' +
			'.TemplateSelectorChoice:hover {' +
				'background-color: #ccc;' +
			'}' +
			'.TemplateSelectorChoice:focus {' +
				'outline: none;' +
			'}' +
			Object.keys(TEMPLATES).map(function (key) {
				return '.' + key + '-active .TemplateSelectorChoice[data-template="' + key + '"] {' +
					'cursor: default;' +
					'outline: none;' +
					'background-color: #eee;' +
				'}';
			}).join('') +
		'</style>' +
		Object.keys(TEMPLATES).map(function (key) {
			return '<button class="TemplateSelectorChoice" data-template="' + key + '">' + TEMPLATES[key].label + '</button>';
		}).join('')
	'';

	htmlEl = document.documentElement;
	headEl = document.head;
	bodyEl = document.body;

	selectorEl = document.createElement('div');
	selectorEl.className = 'TemplateSelector';
	selectorEl.innerHTML = MARKUP;
	selectorEl.addEventListener('click', function (event) {
		selectorEl.classList.remove('is-active');
		activate(event.target.dataset['template']);
	});

	bodyEl.appendChild(selectorEl);

	document.documentElement.addEventListener('keydown', toggle, true);
	document.documentElement.addEventListener('keyup', toggle, true);

	activate(params['template'] || localStorage.getItem('active-template-key') || Object.keys(TEMPLATES)[0]);
})();
