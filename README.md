# nerthusaddon
  Addon for nerthus server in game [margonem](http://www.margonem.pl/)


### How to test changes?
  * In order to run addon in version from master branch set in console variable `localStorage.NerthusAddonDebug = true` 
  * In order to back to normal version `localStorage.NerthusAddonDebug = false` or `delete localStorage.NerthusAddonDebug`
  

### How to introduce changes to game
  * Put desired revision hash to file [version.json](version.json)
  * It usually takes couple minutes before changes are visible in game
  * Only exception are changes in [NN_start.js](NN_start.js), changes there require addon link update on [server command site](http://serwery.margonem.pl/)
  
  
### How to deliver changes? 
  * Feel free to make pull requests


### How to run light manager in game?
  * run in console `nerthus.night.lights.give_me_the_light()`
  * dumping light configuration `nerthus.night.lights.dump()`
