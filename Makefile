test:
	mocha -u qunit -R spec

test-leaks:
	mocha -u qunit -R spec --check-leaks

test-simple:
	mocha -u qunit -C

instal-test-dependencies:
	npm install
#	npm install mocha
#	npm install expect.js
#	npm install jsdom
#	npm install jquery
#	npm install nyc --save-dev
#	npm install coveralls --save-dev

check-syntax:
	bash ./test_js_syntax.sh

run-tests-with-coverage: clean-coverage test-with-coverage coverage-raport-text

test-with-coverage:
	bash ./for_each_test_file.sh npm run test-with-coverage

push-coverage-raport:
	npm run push-coverage-raport

coverage-raport-text:
	npm run coverage-raport-text

clean-coverage:
	rm -rf ./coverage ./.nyc_output

.PHONY: test test-simpe test-leaks check-syntax run-tests-with-coverage test-with-coverage push-coverage-raport coverage-raport-text clean-coverage
