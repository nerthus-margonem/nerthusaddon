[![Build Status](https://travis-ci.org/akrzyz/nerthusaddon.svg?branch=master)](https://travis-ci.org/akrzyz/nerthusaddon)
# nerthusaddon
  Addon for nerthus server in game [margonem](http://www.margonem.pl/)

### How to update addon to newest version?
  * put in console `delete localStorage.nerthus` and refresh game 

### How to test changes in game?
  * In order to run addon in version from master branch set in console variable `localStorage.NerthusAddonDebug = true` 
  * In order to back to normal version `delete localStorage.NerthusAddonDebug`
 
### How to run tests
  * runing tests require nodejs and some node modules
  * run `make test_deps` to install dependencies
  * to run tests type `make test` in project root directory
  * tests are written in QUnit framework
 
### How to introduce changes to game
  * Put desired revision hash to file [version.json](version.json)
  * It usually takes couple minutes before changes are visible in game
  * Only exception are changes in [NN_start.js](NN_start.js), changes there require addon link update on [server command site](http://serwery.margonem.pl/)
  
### How to deliver changes? 
  * Feel free to make pull requests

### How to run light manager in game?
  * run in console `nerthus.night.lights.give_me_the_light()`
  * dumping light configuration `nerthus.night.lights.dump()`
