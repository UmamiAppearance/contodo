/**
 * [contodo]{@link https://github.com/UmamiAppearance/contodo}
 *
 * @version 0.1.0
 * @author UmamiAppearance [mail@umamiappearance.eu]
 * @license GPL-3.0
 */

import { isIdentifier, isPositiveInteger } from "./utils.js";
import defaultCSS from "./default-css.js";

/**
 * Creates a html node which displays browser console
 * entries. It is possible to mirror the console or 
 * to stop the default console from logging.
 * The methods "console.dir/dirxml" and console.group*
 * are not available. Every other method can be rendered
 * into a document node.
 *
 * Inspired by https://github.com/bahmutov/console-log-div
 */
class ConTodo {

    /**
     * The constructor sets all options, stores the
     * default console and initializes the document
     * node to a provided patent node. If it is not
     * provided contodo is appended to the body.
     *  
     * @param {object} [node=document.body] - Parent document node. 
     * @param {object} [options] - Options object.
     */
    constructor(node, options={}) {
        
        // Parent Node
        this.parentNode = (node) ? node : document.body;

        // Helper function to test, wether an option
        // was set.
        const hasOption = (key) => Object.prototype.hasOwnProperty.call(options, key);

        // (Default) Options
        this.options = {
            applyCSS: hasOption("applyCSS") ? Boolean(options.applyCSS) : true,
            autostart: hasOption("autostart") ? Boolean(options.autostart) : true,
            catchErrors: hasOption("catchErrors") ? Boolean(options.catchErrors) : false,
            height: hasOption("height") ? options.height : "inherit",
            maxEntries: hasOption("maxEntries") ? Math.max(parseInt(Number(options.maxEntries), 10), 0) : 0,
            preventDefault: hasOption("preventDefault") ? Boolean(options.preventDefault) : false,
            reversed: hasOption("reversed") ? Boolean(options.reversed) : false,
            style: hasOption("style") ? options.style : "default",
            showDebugging: hasOption("showDebugging") ? Boolean(options.showDebugging) : true,
            showTimestamp: hasOption("showTimestamp") ? Boolean(options.showTimestamp) : false,
            width: hasOption("width") ? options.width : "inherit"
        };
        
        // Store Default Console Methods
        this.defaultConsole = {
            assert: console.assert.bind(console),
            count: console.count.bind(console),
            countReset: console.countReset.bind(console),
            clear: console.clear.bind(console),
            debug: console.debug.bind(console),
            error: console.error.bind(console),
            exception: console.exception ? console.exception.bind(console) : null,
            info: console.info.bind(console),
            log: console.log.bind(console),
            table: console.table.bind(console),
            time: console.time.bind(console),
            timeEnd: console.timeEnd.bind(console),
            timeLog: console.timeLog.bind(console),
            trace: console.trace.bind(console),
            warn: console.warn.bind(console)
        };
   
        // Class values
        this.active = false;
        this.counters = new Object();
        this.mainElem = null;
        this.style = null;
        this.timers = new Object;

        // Bind Error Function to Class
        this.catchErrorFN = this.catchErrorFN.bind(this);

        // Auto Init
        if (this.options.autostart) {
            this.createDocumentNode();
            this.initFunctions();
        }
    }


    /**
     * Creates the actual node in the document.
     */
    createDocumentNode() {
        if (!this.mainElem) {
            this.mainElem = document.createElement("code");
            this.parentNode.append(this.mainElem);
            this.mainElem.classList.add("contodo", this.options.style);
            this.mainElem.style.height = this.options.height;
            this.logCount = 0;
        }
        if (this.options.applyCSS) {
            this.applyCSS();
        }
    }


    /**
     * Removes contodo node from document
     */
    destroyDocumentNode() {
        if (this.active) {
            this.restoreDefaultConsole();
        }
        if (!this.mainElem) {
            return;
        }
        this.mainElem.remove();
        this.mainElem = null;
    }


    /**
     * Replaces default console methods with
     * contodo methods.
     */
    initFunctions() {
        if (this.active) {
            return;
        }
        console.assert = (bool, ...args) => this.assert(bool, args);
        console.count = (label) => this.count(label);
        console.countReset = (label) => this.countReset(label);
        console.counters = () => this.countersShow();
        console.clear = () => this.clear();
        console.debug = (...args) => this.debug(args);
        console.error = (...args) => this.makeLog("error", args);
        console.exception = console.error;
        console.info = (...args) => this.makeLog("info", args);
        console.log = (...args) => this.makeLog("log", args);
        console.table = (...args) => this.makeTableLog(args);
        console.time = (label) => this.time(label);
        console.timeEnd = (label) => this.timeEnd(label);
        console.timeLog = (label) => this.timeLog(label);
        console.timers = () => this.timersShow();
        console.trace = (...args) => this.trace(args);
        console.warn = (...args) => this.makeLog("warn", args);
        if (this.options.catchErrors) window.addEventListener("error", this.catchErrorFN, false);
        this.active = true;
    }


    /**
     * Restores the console methods.
     */
    restoreDefaultConsole() {
        if (!this.active) {
            return;
        }
        console.assert = this.defaultConsole.assert;
        console.count = this.defaultConsole.count;
        console.countReset = this.defaultConsole.countReset;
        delete console.counters;
        console.clear = this.defaultConsole.clear;
        console.debug = this.defaultConsole.debug;
        console.error = this.defaultConsole.error;
        console.exception = this.defaultConsole.exception;
        console.info = this.defaultConsole.info;
        console.log = this.defaultConsole.log;
        console.table = this.defaultConsole.table;
        console.time = this.defaultConsole.time;
        console.timeEnd = this.defaultConsole.timeEnd;
        console.timeLog = this.defaultConsole.timeLog;
        delete console.timers;
        console.trace = this.defaultConsole.trace;
        console.warn = this.defaultConsole.warn;
        if (this.options.catchErrors) window.removeEventListener("error", this.catchErrorFN, false);
        this.active = false;
    }


    /**
     * Allows the displaying of errors inside of contodo.
     * @param {*} err 
     */
    catchErrorFN(err) {
        this.makeLog(
            "error", 
            [
                "Uncaught",
                err.message,
                "\n",
                `  > ${err.filename}`,
                "\n",
                `  > line ${err.lineno}, colum ${err.colno}`
            ],
            true
        );
    }


    /**
     * Applies CSS to document.
     */
    applyCSS() {
        if (this.style) {
            return;
        }
        this.style = document.createElement("style"); 
        this.style.append(document.createTextNode(defaultCSS));
        document.head.append(this.style);
    }


    /**
     * Removes CSS from document.
     */
    removeCSS() {
        if (!this.style) {
            return;
        }
        this.style.remove();
        this.style = null;
    }


    /**
     * Console[error|info|log|warn] to node. It adds a 
     * symbol at the start of the log for any other than 
     * log and calls if not prevented.
     * It is called by many other methods to generate
     * output. 
     * @param {string} type - error|info|log|warn
     * @param {Array} args - Message arguments.
     * @param {boolean} [preventDefaultLog=this.options.preventDefault] - If true it does not log to the default console.
     */
    makeLog(type, args, preventDefaultLog=this.options.preventDefault) {
        const infoAdder = {
            error: "⛔",
            info: "ⓘ",
            warn: "⚠️"
        };

        if (!preventDefaultLog) {
            this.defaultConsole[type](...args);
        }

        const newLog = this.#makeDivLogEntry(type);
        const lastIndex = args.length-1;

        // An empty log call only logs an empty space.
        // (It has to log something, otherwise the node 
        // would collapse.)
        if (type === "log" && lastIndex < 0) {
            this.#makeSpaceSpan(newLog);
        }
        
        // Every other type than a log gets its leading symbol
        else if (type !== "log") {
            newLog.append(this.#makeEntrySpan("info", infoAdder[type]));
            this.#makeSpaceSpan(newLog);
        }

        // The input is getting analyzed by "#analyzeInputMakeSpan"
        // which also appends the content to the new log. Every node
        // is followed by a space node (except the very last).
        args.forEach((arg, i) => {
            this.#analyzeInputMakeSpan(arg, newLog);

            if (i !== lastIndex) {
                this.#makeSpaceSpan(newLog);
            }
        });

        // Finally scroll to the current log
        newLog.scrollIntoView();
    }


    /**
     * Prepares the data for a HTML table. The actual
     * node generation is handled by "genHTMLTable",
     * which is called at the end by this prep function.
     * 
     * @param {*} args - Shall be an iterable (otherwise it is a generic log). 
     * @param {*} preventDefaultLog - If true it does not log to the default console.
     */
    makeTableLog(args, preventDefaultLog=this.options.preventDefault) {
        if (!preventDefaultLog) {
            this.defaultConsole.table(...args);
        }

        // Helper function. Test wether the data
        // can be visualized as a table.
        const isIterable = (val) => (typeof val === "object" || (Symbol.iterator in Object(val) && typeof val !== "string"));
        
        let data, cols;
        [data, cols] = args;

        // If it is not possible to create a table from the data,
        // create an ordinary log. (As the default console does)
        if (!isIterable(data)) {
            const msg = (typeof data === "undefined") ? [] : [data];
            this.makeLog("log", msg, true);
        } 
        
        // Deconstruct and prepare the data
        else {
            // Array are converted into objects first
            if (typeof data !== "object") {
                data = Object.assign({}, data);
            }

            // Prepare the columns if not provided
            if (!cols) {
                const colSet = new Set();
                for (let rowKey in data) {
                    let row = data[rowKey];
                    if (!isIterable(row)) {
                        row = [row];
                    }
                    const rowObj = (typeof row !== "object") ? Object.assign({}, row) : row;

                    for (const key in rowObj) {
                        colSet.add(key);
                    } 
                }
                cols = [...colSet];
            }

            // Prepare the header
            let header;
            if (cols.length === 1 && cols[0] == 0) {
                header = ["(Index)", "Value"];
            } else {
                header = ["(Index)", ...cols];
            }

            // Prepare the data
            const tData = [];
            for (const index in data) {
                let row = data[index];
                if (!isIterable(row)) {
                    row = [row];
                }
                const rowObj = (typeof row !== "object") ? Object.assign({}, row) : row;
                const rowArray = [index];

                for (const col of cols) {
                    const colVal = rowObj[col];
                    rowArray.push((colVal === undefined) ? "" : colVal);
                }
                
                tData.push(rowArray);
            }
            
            // Call the html table generation
            this.#genHTMLTable(tData, header);
        }
    }

    /**
     * Creates a new log node and appends it to the
     * contodo main element. 
     * @param {string} [className="log"] - Class name of the log (determines the styling) 
     * @returns {object} - Log Node.
     */
    #makeDivLogEntry(className="log") {        
        let log = document.createElement("div");
        log.classList.add("log", className);

        const dateStr = new Date().toISOString();
        if (this.options.showTimestamp) {
            log.append(this.#makeEntrySpan("time", dateStr));
            log.append("\n");
        }
        log.dataset.date = dateStr;

        this.logCount++;
        let delNode = false;
        if (this.options.maxEntries && this.logCount > this.options.maxEntries) {
            delNode = true;
        }

        if (this.options.reversed) {
            if (delNode) {
                this.mainElem.childNodes[this.options.maxEntries-1].remove();
            }
            this.mainElem.prepend(log);
        } else {
            if (delNode) {
                this.mainElem.childNodes[0].remove();
            }
            this.mainElem.append(log); 
        }

        return log;
    }

    /**
     * Helps to create a classed span inside of the
     * current log (css styled).
     * @param {string} CSSClass - CSS Class of the span elem. 
     * @param {object} content - Span DOM Node.
     * @returns {object} - HTML span node
     */
    #makeEntrySpan(CSSClass, content) {
        const span = document.createElement("span");
        span.classList.add(CSSClass);
        span.textContent = content;
        return span;
    }

    /**
     * Shortcut. Creates a span with the class "space",
     * which contains one space by default.
     * @param {object} log - log node
     * @param {number} [spaces=1] - The amount of spaces.
     */
    #makeSpaceSpan(log, spaces=1) {
        log.append(this.#makeEntrySpan("space", " ".repeat(spaces)));
    }

    /**
     * This error is logged, if the type can't be
     * analyzed. Because of a case, which is not 
     * thought of...
     * @param {*} input - Input Arguments. 
     */
    #foundEdgeCaseError() {
        console.error("You found an edge case, which is not covered yet.\nPlease create an issue mentioning your input at:\nhttps://github.com/UmamiAppearance/contodo/issues");
        
    }

    /**
     * Analyzes the type of a given parameter handed to 
     * the console. It creates a span element with the 
     * required properties. (Can be called recursively)
     * 
     * @param {*} arg - Any input.
     * @param {object} newLog - The current log document node.
     */
    #analyzeInputMakeSpan(arg, newLog) {
        let argType = typeof arg;

        if (argType === "object") {

            // Array and Typed Array
            if (Array.isArray(arg) || (ArrayBuffer.isView(arg) && (arg.constructor.name.match("Array")))) {
                const lastIndex = arg.length - 1;
                newLog.append(this.#makeEntrySpan("object", `${arg.constructor.name} [ `));
                
                arg.forEach((subArg, i) => {
                    let subType = typeof subArg;
                    if (subType === "string") {
                        subArg = `"${subArg}"`;
                        subType = "array-string";
                        newLog.append(this.#makeEntrySpan(subType, subArg));
                    }

                    else {
                        this.#analyzeInputMakeSpan(subArg, newLog);
                    }
                    
                    if (i < lastIndex) {
                        newLog.append(this.#makeEntrySpan("object", ", "));
                    }
                });

                newLog.append(this.#makeEntrySpan("object", " ]"));
            }

            // DataView
            else if (ArrayBuffer.isView(arg)) {
                newLog.append(this.#makeEntrySpan("object", "DataView { buffer: ArrayBuffer, byteLength: "));
                newLog.append(this.#makeEntrySpan("number", arg.byteLength));
                newLog.append(this.#makeEntrySpan("object", ", byteOffset: "));
                newLog.append(this.#makeEntrySpan("number", arg.byteOffset));
                newLog.append(this.#makeEntrySpan("object", " }"));
            }

            // null
            else if (arg === null) {
                newLog.append(this.#makeEntrySpan("null", "null"));
            }
            
            // ArrayBuffer
            else if (arg.constructor.name === "ArrayBuffer") {
                newLog.append(this.#makeEntrySpan("object", "ArrayBuffer { byteLength: "));
                newLog.append(this.#makeEntrySpan("number", arg.byteLength));
                newLog.append(this.#makeEntrySpan("object", " }"));
            }

            // Ordinary Object with key, value pairs
            else if (arg === Object(arg)) {
                newLog.append(this.#makeEntrySpan("object", "Object { "));
                
                const objEntries = Object.entries(arg);
                const lastIndex = objEntries.length - 1;

                // Walk through all entries and call 
                // #analyzeInputMakeSpan recursively
                // for the values
                objEntries.forEach((entry, i) => {
                    entry.forEach((subArg, j) => {
                        let subType = typeof subArg;
                        if (subType === "string") {
                            if (!j) {
                                subType = "object";
                                if (isPositiveInteger(subArg)) {
                                    subArg = Number(subArg).toString();
                                } else if (!isIdentifier(subArg)) {
                                    subArg = `"${subArg}"`;
                                }
                            } else {
                                subArg = `"${subArg}"`;
                                subType = "array-string";
                            }
                            newLog.append(this.#makeEntrySpan(subType, subArg));
                        }

                        else {
                            this.#analyzeInputMakeSpan(subArg, newLog);
                        }

                        if (!j) {
                            newLog.append(this.#makeEntrySpan("object", ": "));
                        }
                    });
                    
                    if (i < lastIndex) {
                        newLog.append(this.#makeEntrySpan("object", ", "));
                    }
                });
                newLog.append(this.#makeEntrySpan("object", " }"));
            }
            

            // Unexpected Object Type
            else {
                this.#foundEdgeCaseError();
            }
        }

        // Function
        else if (argType === "function") {
            // cf. https://stackoverflow.com/a/31194949
            let fnStr = Function.toString.call(arg);
            const isClass = Boolean(fnStr.match(/^class/));
            let hasConstructor = true;
            let paramArray;
            
            // Arrow Function
            if (fnStr.match("=>")) {
                paramArray = fnStr
                    .replace(/\s+/g, "")                        // remove all whitespace
                    .replace(/=>.*/, "")                        // remove everything after the arrow
                    .replace(/(\(|\))/g, "")                    // remove brackets
                    .split(",")                                 // split parameters
                    .filter(Boolean);                           // filter [""]
            }
            
            // Class without constructor
            else if (isClass && !fnStr.match("constructor")) {
                hasConstructor = false;
                paramArray = [];
            }
            
            // Class and regular Functions
            else {
                paramArray = fnStr
                    .replace(/\/\/.*$/mg,"")                    // strip single-line comments
                    .replace(/\s+/g, "")                        // strip white space
                    .replace(/\/\*[^/*]*\*\//g, "")             // strip multi-line comments  
                    .split("){", 1)[0].replace(/^[^(]*\(/, "")  // extract the parameters
                    .replace(/=[^,]+/g, "")                     // strip any ES6 defaults 
                    .split(",")                                 // split parameters
                    .filter(Boolean);                           // filter [""]
            }
 
            // Join function arguments
            const params = paramArray.join(", ");
            
            if (isClass) {
                if (hasConstructor) {
                    newLog.append(this.#makeEntrySpan("function", `class ${arg.name} { constructor(`));
                    newLog.append(this.#makeEntrySpan("fn-args", params));
                    newLog.append(this.#makeEntrySpan("function", ") }"));
                } else {
                    newLog.append(this.#makeEntrySpan("function", `class ${arg.name} {}`));
                }
            } else {
                newLog.append(this.#makeEntrySpan("function", `function ${arg.name}(`));
                newLog.append(this.#makeEntrySpan("fn-args", params));
                newLog.append(this.#makeEntrySpan("function", ")"));
            }
        }

        // "undefined"
        else if (argType === "undefined") {
            newLog.append(this.#makeEntrySpan("null", "undefined"));
        }

        // String
        else {
            
            if (argType === "string") {
                // Empty String
                if (arg === "") {
                    arg = "<empty string>";
                }
                // All other strings just pass
            }
            
            // BigInt
            else if (argType === "bigint") {
                arg += "n";
            }
            
            // Symbol
            else if (argType === "symbol") {
                arg = arg.toString().replace("(", "(\"").replace(")", "\")");
            }
            
            // NaN
            else if (isNaN(arg)) {
                argType = "null";
            }

            // Unexpected Type
            else {
                this.#foundEdgeCaseError(arg);
            }
            newLog.append(this.#makeEntrySpan(argType, arg));
        }
    }


    /**
     * Creates a HTML table from the given input.
     * (Which must be an array of object to make
     * it work).
     * @param {*} data 
     * @param {*} header 
     */
    #genHTMLTable(data, header) {
        const table = document.createElement("table");
        
        const tHead = document.createElement("thead");
        const trHead = document.createElement("tr");

        for (const head of header) {
            const th = document.createElement("th");
            th.append(document.createTextNode(head));
            trHead.append(th);
        }
        
        tHead.append(trHead);
        table.append(tHead);


        const tBody = document.createElement("tbody");

        for (const row of data) {
            const tr = document.createElement("tr");

            for (const col of row) {
                const td = document.createElement("td");
                td.append(document.createTextNode(col));
                tr.append(td);
            }

            tBody.append(tr);
        }

        table.append(tBody);


        let divLog = this.#makeDivLogEntry();
        divLog.append(table);

        table.scrollIntoView();
    }

    /**
     * Converts the input to a label string.
     * If the input is undefined output will
     * be "default";
     * @param {*} [label] 
     * @returns {string} - label
     */
    #makeLabelStr(label) {
        if (typeof label === "undefined") {
            label = "default";
        } else {
            label = String(label);
        }
        return label;
    }

    /**
     * console.assert
     * @param {boolean} bool - Result of a comparison 
     * @param {*} [args] - Parameter are appended to the assertion call.
     */
    assert(bool, args) {
        if (!this.options.preventDefault) {
            this.defaultConsole.assert(bool, ...args);
        }
        if (!bool) {
            this.makeLog("error", ["Assertion failed:", ...args], true);
        }
    }

    /**
     * console.count
     * @param {*} [label] - Input gets converted to string. Label is "default" if nothing is passed. 
     */
    count(label) {
        label = this.#makeLabelStr(label);

        if (!this.counters[label]) {
            this.counters[label] = 1;
        } else {
            this.counters[label] ++;
        }
        this.makeLog("log", [`${label}: ${this.counters[label]}`]);
    }

    /**
     * console.countReset
     * @param {*} [label] - Corresponding label.
     */
    countReset(label) {
        label = this.#makeLabelStr(label);
        
        if (Object.prototype.hasOwnProperty.call(this.counters, label)) {
            this.counters[label] = 0;
            this.makeLog("log", [`${label}: ${this.counters[label]}`]);
        } else {
            const msg = `Count for '${label}' does not exist`;
            this.makeLog("warn", [msg]);
        }
        
    }

    /**
     * Bonus feature. Shows all current counters via
     * console.table.
     */
    countersShow() {
        if (Object.keys(this.counters).length) {
            this.makeTableLog([this.counters]);
        }
    }

    /**
     * console.clear
     */
    clear() {
        if (!this.options.preventDefault) {
            this.defaultConsole.clear();
        }
        this.mainElem.innerHTML = "";
        this.logCount = 0;
        this.makeLog("log", ["Console was cleared"], true);
    }

    /**
     * console.debug
     * Nowadays console.debug and console.log are identical
     * in browsers. With contodo it is possible to only show
     * debug logs if debugging is globally enabled. (Which
     * is the case by default)
     * @param {} args 
     */
    debug(args) {
        if (!this.options.preventDefault) {
            this.defaultConsole.debug(...args);
        }
        if (this.options.showDebugging) {
            this.makeLog("log", args, true);
        }
    }

    /**
     * console.time
     * @param {*} [label] - Input gets converted to string. Label is "default" if nothing is passed. 
     */
    time(label) {
        const now = window.performance.now();
        label = this.#makeLabelStr(label);

        if (!this.timers[label]) {
            this.timers[label] = now;
        } else {
            const msg = `Timer '${label}' already exists`;
            this.makeLog("warn", [msg], true);

            if (!this.options.preventDefault) {
                this.defaultConsole.warn(msg);
            }
        }
    }

    /**
     * console.timeLog and console.timeEnd are 
     * basically the same function. The latter
     * only differs in terms of deleting the 
     * timer. Therefore this helper function 
     * was created. 
     * @param {*} [label] - Corresponding label. 
     * @returns {string} - label
     */
    #timeLogEnd(label) {
        const now = window.performance.now();
        label = this.#makeLabelStr(label);
        const elapsed = now - this.timers[label];

        let msg;
        let type;

        if (this.timers[label]) {
            msg = `${label}: ${elapsed} ms`;
            type = "log";
        } else {
            msg = `Timer '${label}' does not exist`;
            type = "warn";
        }

        this.makeLog(type, [msg], true);
        if (!this.options.preventDefault) {
            this.defaultConsole[type](msg);
        }
        
        return label;
    }

    /**
     * console.timeEnd
     * @param {*} [label] - Corresponding label. 
     */
    timeEnd(label) {
        label = this.#timeLogEnd(label);
        delete this.timers[label];
    }

    /**
     * console.timeEnd
     * @param {*} [label] - Corresponding label. 
     */
    timeLog(label) {
        this.#timeLogEnd(label);
    }

    /**
     * Bonus feature. Shows all current timers via
     * console.table.
     */
    timersShow() {
        const now = window.performance.now();
        const timers = new Object();
        for (const timer in this.timers) {
            timers[timer] = `${now - this.timers[timer]} ms`;
        }
        if (Object.keys(timers).length) {
            this.makeTableLog([timers]);
        }
    }

    /**
     * console.trace
     * This one is a little hacky. It is not
     * possible to call trace directly, as this
     * file and the caller are part of the stack.
     * To reach the aimed goal, a generic Error
     * is thrown and catched to get a stack, which
     * then cleaned up.
     *  
     * @param {*} args 
     */
    trace(args) {
        let stack;
        try {
            throw new Error();
        } catch (err) {
            stack = err.stack;
        }

        const stackArr = [];
        let addLine = false;
        let lenLeft = 0;
        
        stack.split("\n").slice(0, -1).forEach(line => {

            if (!addLine && line.match("console.trace")) {
                addLine = true;
            }
            
            else if (addLine) {
                let name, file;
                [name, file] = line.split("@");
                if (!name) {
                    name = "(anonymous)";
                }
                const len = name.length;
                lenLeft = Math.max(lenLeft, len);
                stackArr.push({name, file, len});
            }
        });

        lenLeft++;

        // html trace
        const newLog = this.#makeDivLogEntry();
        newLog.append(this.#makeEntrySpan("trace-head", "console.trace()"));

        for (const arg of args) {
            this.#makeSpaceSpan(newLog);
            this.#analyzeInputMakeSpan(arg, newLog);
        }

        newLog.append("\n");

        for (const line of stackArr) {
            this.#makeSpaceSpan(newLog);
            newLog.append(this.#makeEntrySpan("trace-name", line.name));
            this.#makeSpaceSpan(newLog, lenLeft-line.len);
            newLog.append(this.#makeEntrySpan("trace-file", line.file));
            newLog.append("\n");
        }

        newLog.scrollIntoView();
        
        // default console trace
        if (!this.options.preventDefault) {
            const msg = ["%cconsole.trace()", "color:magenta;", ...args, "\n"];
            
            for (const line of stackArr) {
                msg.push(`  ${line.name}${" ".repeat(lenLeft-line.len)}${line.file}\n`);
            }

            this.defaultConsole.log(...msg);
        }
    }
}

export default ConTodo;
