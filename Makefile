test:
	mocha -u qunit -R spec

test_simple:
	mocha -u qunit -C

.PHONY: test test_simpe
