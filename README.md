# contodo

[![npm](https://img.shields.io/npm/v/contodo?color=%23009911&style=for-the-badge)](https://www.npmjs.com/package/contodo)

_HTML Console._ Let's you output your browser **con**sole **to** a **do**cument node.


## Installation
### GitHub
```sh
git clone https://github.com/UmamiAppearance/BaseExJS.git
```

### npm
```sh
nmp install base-ex
```

## Builds
The GitHub repository has ready to use builds included. You can find them in [dist](https://github.com/UmamiAppearance/contodo/tree/main/dist). The npm package comes without pre build files. 

For building run:
```sh
npm run build
```

Either way you have two builds available ([esm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [iife](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)), plus a minified version of each. 
* ``contodo.esm.js``
* ``contodo.esm.min.js``
* ``contodo.iife.js``
* ``contodo.iife.min.js``


## Usage
First either import the esm-module or add the iife script tag to the html page. After that, the constructor ***ConTodo** is available and ready to use:

### ES6
```html
<script type="module">
    import ConTodo from "./<path>/contodo.esm.min.js";
    const contodo = new ConTodo();
</script>
```

### IIFE
```html
<script src="./<path>/contodo.iife.min.js"></script>
<script>
    const contodo = new ConTodo();
</script>
```

### Demo
A demo can be found [here](https://umamiappearance.github.io/contodo/examples/demo.html).


## Options
`new ConTodo(node[, options])`

### `node`
Type: `Object`  
Default: `null`  

Pass a document node on which **contodo** should be attached to. If nothing or a _nullish_ value is passed, the console gets attached to to the document body.

### `options`
Type: `Object`  
Default: `{}`  

##### arguments:
| key            | type                 | default     | effect                                                   |
| -------------- | -------------------- | ----------- | -------------------------------------------------------- |
| applyCSS       | _Boolean_            | `true`      | applies the build in css to the document                 |
| autostart      | _Boolean_            | `true`      | initializes and attaches the console automatically       |
| catchErrors    | _Boolean_            | `false`     | displays errors inside of the console node               |
| height         | _String (css-value)_ | `"inherit"` | css value for style height of the console node           |
| maxEntries     | _Number_             | `0`         | removes older entries if the given value (>0) is reached |
| preventDefault | _Boolean_            | `false`     | prevents logging to the internal console                 |
| reversed       | _Boolean_            | `false`     | lets the most recent log appear at the top               |
| showDebugging  | _Boolean_            | `true`      | displays `console.debug` messages                        |
| showTimestamp  | _Boolean_            | `false`     | adds a timestamp to every log                            |
| width          | _String (css-value)_ | `"inherit"` | css value for style width of the console node            |


## Themes
Themes can be found [here](./themes/). Right now there is only the default and a dark theme available, but feel free to make one if you don't like the designs. The default is baked into the build file. Attaching it to the document body can be disabled by passing the [option](#options-1) `applyCSS: false`. Also there are builds available without build in css.  
If you like to build your own copy of **contodo** with custom css included, modify the [`default.css`](./themes/default.css) before [building](#builds).


## License
This work is licensed under [GPL-3.0](https://opensource.org/licenses/GPL-3.0).
