[![Build Status](https://travis-ci.org/akrzyz/nerthusaddon.svg?branch=master)](https://travis-ci.org/akrzyz/nerthusaddon)
[![Coverage Status](https://coveralls.io/repos/github/akrzyz/nerthusaddon/badge.svg?branch=master)](https://coveralls.io/github/akrzyz/nerthusaddon?branch=master)

Nerthus Addon
======
  Addon for Nerthus server in game [Margonem](http://www.margonem.pl/) adding many features targeted towards role playing.

Installation
------
##### Old game interface:
  - Addon should be installed automatically while you're on Nerthus server.
  - For other servers, check instruction at the bottom of this section.
##### Both game interfaces:
  - Install [Tampermonkey](https://www.tampermonkey.net/) or similar browser extension that allows for external scripts.
  - Head to [install page](https://akrzyz.github.io/nerthusaddon/nerthus_addon.user.js) and click install.
  - Installation should work regardless of interface type.
  - If you're using this installation method with an old game interface, type `gadblock on` in the game's console
  to disallow it from loading basic version. You might additionally need to type `delete localStorage.nerthus` to
  remove traces of the old loading.
##### If you want to test addon outside of Nerthus server:
  - While in game, type in console: `$.getScript('https://akrzyz.github.io/nerthusaddon/NN_start.js')`
  - Addon should now load and work until page reload (new interface) or map change (old interface)
 
FAQ
------
##### How to update addon to newest version?
  - Addon should automatically update to newest version available
  - If that's not the case, put in console `delete localStorage.nerthus` and refresh the page

##### How to test changes in game?
  * In order to run addon in version from master branch set in console variable `localStorage.NerthusAddonDebug = true`
  * In order to back to normal version `delete localStorage.NerthusAddonDebug`

##### How to run tests?
  * running tests require nodejs and npm
  * run `make install-test-dependencies` to install dependencies
  * to run tests type `make run-tests-with-coverage` in project root directory
  * test are run with [mocha](https://mochajs.org/) and [expect](https://github.com/Automattic/expect.js/)
  * tests are written in QUnit framework

##### How to introduce changes to game?
  * Put desired revision hash to file [version.json](version.json)
  * It usually takes couple minutes before changes are visible in game
  * Only exception are changes in [NN_start.js](NN_start.js), changes there require addon link update on [server command site](http://serwery.margonem.pl/)

##### How to deliver changes?
  * Feel free to make pull requests

##### How to run light manager in game?
  * Run in console `nerthus.night.lights.give_me_the_light()`
  * Turn on lights at day `nerthus.night.lights.on()`
  * Dumping light configuration: click dump in menu or `nerthus.night.lights.dump()`
  * Light manager is currently only available on the old interface
