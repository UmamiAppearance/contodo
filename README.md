# contodo

[![License](https://img.shields.io/github/license/UmamiAppearance/contodo?color=009911&style=for-the-badge)](./LICENSE)
[![npm](https://img.shields.io/npm/v/contodo?color=%23009911&style=for-the-badge)](https://www.npmjs.com/package/contodo)

_HTML Console._ Let's you output your browser **con**sole **to** a **do**cument node.

[![contodo-image](https://github.com/UmamiAppearance/contodo/blob/main/media/contodo.gif?raw=true)](https://umamiappearance.github.io/contodo/examples/demo.html)

## Installation
### GitHub
```sh
git clone https://github.com/UmamiAppearance/contodo.git
```

### npm
```sh
nmp install contodo
```

## Builds
Builds can be found in the directory dist ([github:dist](https://github.com/UmamiAppearance/contodo/tree/main/dist)). 

If you want to build your own copy run:
```sh
npm run build
```

You have two builds available ([esm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [iife](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)), plus a minified version of each. 
* ``contodo.esm.js``
* ``contodo.esm.min.js``
* ``contodo.iife.js``
* ``contodo.iife.min.js``

Also in subfolder _no-style_ ([github:dist/no-style](https://github.com/UmamiAppearance/contodo/tree/main/dist/no-style)), there are builds available without build in css.


## Usage
First either import the esm-module or add the iife script tag to the HTML page. After that, the constructor **ConTodo** is available and ready to use:

### ES6
```html
<script type="module">
    import ConTodo from "./<path>/contodo.esm.min.js";
    document.addEventListener("DOMContentLoaded", () => {
        const contodo = new ConTodo();
    });
</script>
```
##### CDN (jsdelivr)
```html
<script type="module">
    import ConTodo from "https://cdn.jsdelivr.net/npm/contodo@latest/dist/contodo.esm.min.js;
    document.addEventListener("DOMContentLoaded", () => {
        const contodo = new ConTodo();
    });
</script>
```


### IIFE
```html
<script src="./<path>/contodo.iife.min.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", () => {
        const contodo = new ConTodo();
    });
</script>
```

##### CDN (jsdelivr)
```html
<script src="https://cdn.jsdelivr.net/npm/contodo@latest/dist/contodo.iife.min.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", () => {
        const contodo = new ConTodo();
    });
</script>
```


### Demo
A demo can be found [here](https://umamiappearance.github.io/contodo/examples/demo.html).  
  
On your local machine, you can run `npm install` once and then `npm start` to open the demo page.


### Options
`new ConTodo(node[, options])`

#### `node`
Type: `Object`  
Default: `null`  

Pass a document node on which **contodo** should be attached to. If nothing or a _nullish_ value is passed, the console gets attached to to the document body.

#### `options`
Type: `Object`  
Default: `{}`  

| key            | type                 | default     | effect                                                   |
| -------------- | -------------------- | ----------- | -------------------------------------------------------- |
| applyCSS       | _Boolean_            | `true`      | applies the build in css to the document                 |
| autostart      | _Boolean_            | `true`      | initializes and attaches the console automatically       |
| catchErrors    | _Boolean_            | `false`     | displays errors inside of the console node               |
| clearButton    | _Boolean_            | `false`     | adds a clickable anchor tag, to clear the console        |
| height         | _String (css-value)_ | `"inherit"` | css value for style height of the console node           |
| maxEntries     | _Number_             | `0`         | removes older entries if the given value (>0) is reached |
| preventDefault | _Boolean_            | `false`     | prevents logging to the internal console                 |
| reversed       | _Boolean_            | `false`     | lets the most recent log appear at the top               |
| showDebugging  | _Boolean_            | `true`      | displays `console.debug` messages                        |
| showTimestamp  | _Boolean_            | `false`     | adds a timestamp to every log                            |
| width          | _String (css-value)_ | `"inherit"` | css value for style width of the console node            |


### Methods

#### `createDocumentNode`
Creates the main document node and appends it to the provided [`node`](#node) or the document body, if nothing is provided.  
The method is called during initialization if the [`option`](#options-1) `autostart` is set.  
If the build in css is available and the [`option`](#options-1) `applyCSS` is set to true, method [`applyCSS`](#applycss) is getting additionally called.

#### `destroyDocumentNode`
Destroys the main node. Also resets the browser console to its default state by calling [`restoreDefaultConsole`](#restoreDefaultConsole).

#### `initFunctions`
Replaces default console methods with the contodo methods. The method is called during initialization if the [`option`](#options-1) `autostart` is set.

#### `restoreDefaultConsole`
Resets the browser console to its default state.

#### `applyCSS`
Applies the build in CSS to the document header (if available and not already applied). This method is automatically getting called by [`createDocumentNode`](#createdocumentnode).

#### `removeCSS`
Removes former applied build in css.

### API
A contodo object holds an `api` object, which directly accesses the console-methods. Those methods are equivalent to the methods of the build in browser console.

### Default console access
After running [`restoreDefaultConsole`](#restoredefaultconsole) the default methods of the console are restored. It is however sometimes necessary to access the default console, while a contodo instance is active. For this case you have access to the default methods at `window._console`.

#### Api Reference
Apart from `console.dir/dirxml` and `console.group` **contodo** has all methods of a browsers console available. A reference of those methods can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Console).


## Themes
Themes can be found [here](./themes/). Right now there is only the default and a dark theme available, but feel free to make one if you don't like the designs. The default is baked into the build file. Attaching it to the document body can be disabled by passing the [option](#options-1) `applyCSS: false`. Also there are builds available without build in css.  
If you like to build your own copy of **contodo** with custom css included, modify the [`default.css`](./themes/default.css) before [building](#builds).


## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022, UmamiAppearance
