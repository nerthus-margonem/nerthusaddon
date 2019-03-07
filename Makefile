test:
	mocha -u qunit -R spec

test-leaks:
	mocha -u qunit -R spec --check-leaks

test-simple:
	mocha -u qunit -C

test-deps:
	npm install
#	npm install mocha
#	npm install expect.js
#	npm install jsdom
#	npm install jquery
#	npm install nyc --save-dev
#	npm install coveralls --save-dev

check:
	bash ./test_js_syntax.sh

test-coverage:
	npm run test-coverage

coverage:
	npm run coverage

.PHONY: test test-simpe test-leaks check test-coverage coverage
