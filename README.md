[![Coverage Status](https://coveralls.io/repos/github/akrzyz/nerthusaddon/badge.svg?branch=master)](https://coveralls.io/github/akrzyz/nerthusaddon?branch=master)

Nerthus Addon
======
  Addon for Nerthus server in game [Margonem](http://www.margonem.pl/) adding many features targeted towards role-playing.

Installation
------
##### Old game interface:
  - Addon should be installed automatically while you're on Nerthus server.
  - For other servers, check instruction at the bottom of this section.
##### Both game interfaces:
  - Install [Tampermonkey](https://www.tampermonkey.net/) or similar browser extension that allows for external scripts.
  - Head to [install page](https://cdn.jsdelivr.net/gh/nerthus-margonem/nerthusaddon@production/nerthus-addon.user.js) and click install.
  - Installation should work regardless of interface type.
  - If you're using this installation method with an old game interface, type `gadblock on` in the game's console
  to disallow it from loading basic version.
##### If you want to test addon outside of Nerthus server:
  - While in game, type in a console: `$.getScript('https://cdn.jsdelivr.net/gh/nerthus-margonem/nerthusaddon@production/nerthus-addon.user.js')`
  - Addon should now load and work until the page reload (new interface) or map change (old interface)
 
FAQ
------
##### How to update addon to the newest version?
  - Addon should automatically update to the newest version available

##### How to test changes in game?
  - Change urls in [webpack.config.js](webpack.config.js) and [nerthus-addon.user.js](nerthus-addon.user.js) to point to your localhost
  - Install the local version using new [nerthus-addon.user.js](nerthus-addon.user.js)
  - Build your version with changes using `npm run build`
  - Test changes
  
##### How to run tests?
  - Make sure you have installed dependencies (run `npm i`)
  - Type `npm run test` in project's root directory
  - Tests use [mocha](https://mochajs.org/) and [expect](https://github.com/Automattic/expect.js/)
  
##### How to introduce changes to game?
  - Push source changes to `main` branch.
  - Create new release using [releases interface](https://github.com/nerthus-margonem/nerthusaddon/releases). Try to use semantic versioning.
  - Github actions should now automatically update the production branch with your build.
  - Changes to [nerthus-addon.user.js](nerthus-addon.user.js) require manual update on [server command site](http://serwery.margonem.pl/)

##### How to deliver changes?
  - Feel free to make pull requests
