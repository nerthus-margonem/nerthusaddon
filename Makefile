test:
	mocha -u qunit -R spec

test_simple:
	mocha -u qunit -C

test_deps:
	npm install mocha
	npm install expect.js
	npm install jsdom
	npm install jquery

check:
	bash ./test_js_syntax.sh

.PHONY: test test_simpe check
