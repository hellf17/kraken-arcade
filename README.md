# Phaser 3 Webpack Project Template

A Phaser 3 project template with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/) that includes hot-reloading for development and production-ready builds.

This has been updated for Phaser 3.50.0 version and above.

Loading images via JavaScript module `import` is also supported, although not recommended.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

_Monolith:_
  _Before Doing the Things Below!_
  
  It may help to run the following command in your terminal before installing the node packages.

  What you will need to do, is, install the latest version of NodeJS. The link for that is located above in the "Requirements" section. It should currently be version 20.5.0.

  Then, you will need to open the repository in your IDE. Ideally, the IDE you use is VSCode, but, of course, there are other IDE's as well.

  Then, open a terminal within the IDE (while the repository/folder is open), or simply open the project folder in a separate terminal, it is essentially the same. 

  Then, type in the following command into the terminal:
  
      `export NODE_OPTIONS=--openssl-legacy-provider`

      This command will fix a LOT of issues that node packages may cause you when running the new additions I have made.

  Then, you can continue to do the commands below, and you should have no issues when you do the `npm start` command, which, starts the live dev server through webpack, and opens a browser tab to interact with your game and test things.

  If there are any issues you have, let me know!

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm start`.

After starting the development server with `npm start`, you can edit any files in the `src` folder and webpack will automatically recompile and reload your server (available at `http://localhost:8080` by default).

## Customizing the Template

### Babel

You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

 ```
"browsers": [
  ">0.25%",
  "not ie 11",
  "not op_mini all"
]
 ```

### Webpack

If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can modify the `webpack/base.js` file for cross-project changes, or you can modify and/or create new configuration files and target them in specific npm tasks inside of `package.json'.

## Deploying Code

After you run the `npm run build` command, your code will be built into a single bundle located at `dist/bundle.min.js` along with any other assets you project depended. 

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://mycoolserver.com`), you should be able to open `http://mycoolserver.com/index.html` and play your game.