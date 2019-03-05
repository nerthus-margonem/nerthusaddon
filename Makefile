test:
	mocha -u qunit -R spec

test_simple:
	mocha -u qunit -C

test_deps:
	npm install
#	npm install mocha
#	npm install expect.js
#	npm install jsdom
#	npm install jquery
#	npm install nyc --save-dev
#	npm install coveralls --save-dev

check:
	bash ./test_js_syntax.sh

test_coverage:
	npm run test-coverage

coverage:
	npm run coverage

.PHONY: test test_simpe check test_coverage coverage
