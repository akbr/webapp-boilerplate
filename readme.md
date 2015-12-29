A simple boilerplate project for web development.

Features:

* web server (port 8080) with livereload (port 35729)
* es6 transpiling
* pre-built dependencies (from package.json)

Install:

* Add dependencies in package.json, if desired
* `npm install`
* `gulp build // compiles third-party dependencies` 
* `gulp // watch src directory`
* Connect to build/index.html
* Edit away!

Notes:

* Aftering adding new dependencies to package.json, you must re-run `gulp build`.