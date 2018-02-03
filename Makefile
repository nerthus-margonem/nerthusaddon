test:
	mocha -u qunit -R spec

test_simple:
	mocha -u qunit -C

test_deps:
	npm install mocha
	npm install expect.js

.PHONY: test test_simpe
