![Tests Status](https://github.com/nerthus-margonem/nerthusaddon/workflows/Tests/badge.svg?branch=main)

Nerthus Addon
======
  Addon for Nerthus server in game [Margonem](http://www.margonem.pl/) adding many features targeted towards role-playing.

Installation
------
##### Both game interfaces:
  - Addon should be installed automatically while you're on Nerthus server.
  - For other servers, check instruction at the bottom of this section.
##### Both game interfaces (alternative):
  - Install [Tampermonkey](https://www.tampermonkey.net/) or similar browser extension that allows for external scripts.
  - Head to [install page](https://cdn.jsdelivr.net/gh/nerthus-margonem/nerthusaddon@production/dist/nerthus-addon.user.js) and click `install`.
  - Installation should work regardless of interface type.
  - If you're using this installation method with an old game interface on Nerthus server,
    type `gadblock on` in the game's console to disallow it from loading a basic version.
  - If you're using this installation method with a new game interface on Nerthus server,
    type `Engine.globalAddons.setVisibleOfTurnOnOffAddonButton(true)` in the game's console
    and click the button that will appear to disallow it from loading a basic version.
##### If you want to test addon outside of Nerthus server:
  - While in game, type in a console: `$.getScript('https://cdn.jsdelivr.net/gh/nerthus-margonem/nerthusaddon@production/dist/nerthus-addon.user.js')`
  - Addon should now load and work until the page reload (new interface) or map change (old interface)
 
FAQ
------
##### How to update addon to the newest version?
  - Addon should automatically update to the newest version available

##### How to set up a local environment for development?
  - Make sure you have the latest LTS NodeJS installed
  - Clone the repository: `git clone https://github.com/nerthus-margonem/nerthusaddon.git`
  - Go inside the created directory: `cd nerthusaddon`
  - Install the dependencies: `npm install`
  - Run setup: `npm run dev-setup`
  - Start development server: `npm run dev-start`
  - Install userscript by navigating the browser to http://localhost:8080/dist/nerthus-addon.user.js and clicking install

Next time you want to start the server and live reload,
you only need to type `npm run dev-start` and you will be all set.
  
##### How to run tests?
  - Make sure you have installed dependencies (run `npm i`)
  - Type `npm run test` in project's root directory
  - Tests use [mocha](https://mochajs.org/) and [expect](https://github.com/Automattic/expect.js/)
  
##### How to introduce changes to game?
  - Push source changes to `main` branch.
  - Create new release using [releases interface](https://github.com/nerthus-margonem/nerthusaddon/releases). Try to use semantic versioning.
  - GitHub Actions should now automatically update the production branch with your build.
  - Changes to [userscript](src/userscript.js) require manual update on [server command site](http://serwery.margonem.pl/)

##### How to deliver changes?
  - Feel free to make pull requests
