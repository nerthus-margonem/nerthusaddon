# nerthusaddon
  Addon for nerthus server in game [margonem](http://www.margonem.pl/)


### How to test changes?
  * In console set variable `localStorage.NerthusAddonDebug = true` 
  * In order to back to normal version `del localStorage.NerthusAddonDebug`
  

### How to introduce changes to game
  * Put desired revision hash to file [version.json](version.json)
  * It usually takes couple minutes before changes are visible in game
  * Only exception are changes in [NN_start.js](NN_start.js), changes there require addon link update on [server command site](http://serwery.margonem.pl/)
