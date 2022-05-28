/*
 * [HTMLConsole]{@link https://github.com/UmamiAppearance/HTMLConsole}
 *
 * @version 0.1.0
 * @author UmamiAppearance [mail@umamiappearance.eu]
 * @license GPL-3.0
 */

import { isIdentifier, isPositiveInteger } from "./utils.js";
import defaultCSS from "./default-css.js";

/**
 * Mirror console logs into a code tag.
 *
 * Inspired by https://github.com/bahmutov/console-log-div
 */
class HTMLConsole {
    constructor(node, options={}) {
        
        this.parentNode = (node) ? node : document.body;

        const hasOption = (key) => Object.prototype.hasOwnProperty.call(options, key);

        this.options = {
            applyCSS: hasOption("applyCSS") ? Boolean(options.applyCSS) : true,
            autostart: hasOption("autostart") ? Boolean(options.autostart) : true,
            catchErrors: hasOption("catchErrors") ? Boolean(options.catchErrors) : false,
            height: hasOption("height") ? options.height : "inherit",
            maxEntries: hasOption("maxEntries") ? Math.max(parseInt(Number(options.maxEntries), 10), 0) : 0,
            name: hasOption("name") ? options.name : "html-console",
            preventDefault: hasOption("preventDefault") ? Boolean(options.preventDefault) : false,
            reversed: hasOption("reversed") ? Boolean(options.reversed) : false,
            style: hasOption("style") ? options.style : "default",
            showDebugging: hasOption("showDebugging") ? options.showDebugging : true, 
            width: hasOption("width") ? options.width : "inherit"
        };
        
        this.defaultConsole = {
            assert: console.assert.bind(console),
            count: console.count.bind(console),
            countReset: console.countReset.bind(console),
            clear: console.clear.bind(console),
            debug: console.debug.bind(console),
            error: console.error.bind(console),
            info: console.info.bind(console),
            log: console.log.bind(console),
            table: console.table ? console.table.bind(console) : null,
            time: console.time.bind(console),
            timeEnd: console.timeEnd.bind(console),
            timeLog: console.timeLog.bind(console),
            trace: console.trace.bind(console),
            warn: console.warn.bind(console)
        };
   
        this.active = false;
        this.counters = new Object();
        this.consoleHasTable = (typeof this.defaultConsole.table === "function");
        this.mainElem = null;
        this.style = null;
        this.timers = new Object;

        this.catchErrorFN = this.catchErrorFN.bind(this);

        if (this.options.autostart) {
            this.createDocumentNode();
            this.initFunctions();
        }
    }

    createDocumentNode() {
        if (!this.mainElem) {
            this.mainElem = document.createElement("code");
            this.parentNode.append(this.mainElem);
            this.mainElem.classList.add("html-console", this.options.name, this.options.style);
            this.mainElem.style.height = this.options.height;
            this.logCount = 0;
        }
        if (this.options.applyCSS) {
            this.applyCSS();
        }
    }

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

    initFunctions() {
        if (this.active) {
            return;
        }
        console.assert = (bool, ...args) => this.assert(bool, args);
        console.count = (label) => this.count(label);
        console.countReset = (label) => this.countReset(label);
        console.clear = () => this.clear();
        console.debug = (...args) => this.debug(args);
        console.error = (...args) => this.makeLog("error", args);
        console.info = (...args) => this.makeLog("info", args);
        console.log = (...args) => this.makeLog("log", args);
        console.table = (...args) => this.makeTableLog(args);
        console.time = (label) => this.time(label);
        console.timeEnd = (label) => this.timeEnd(label);
        console.timeLog = (label) => this.timeLog(label);
        console.trace = (...args) => this.trace(args);
        console.warn = (...args) => this.makeLog("warn", args);
        if (this.options.catchErrors) window.addEventListener("error", this.catchErrorFN, false);
        this.active = true;
    }

    restoreDefaultConsole() {
        if (!this.active) {
            return;
        }
        console.assert = this.defaultConsole.assert;
        console.count = this.defaultConsole.count;
        console.countReset = this.defaultConsole.countReset;
        console.clear = this.defaultConsole.clear;
        console.debug = this.defaultConsole.debug;
        console.error = this.defaultConsole.error;
        console.info = this.defaultConsole.info;
        console.log = this.defaultConsole.log;
        console.table = this.defaultConsole.table;
        console.time = this.defaultConsole.time;
        console.timeEnd = this.defaultConsole.timeEnd;
        console.timeLog = this.defaultConsole.timeLog;
        console.trace = this.defaultConsole.trace;
        console.warn = this.defaultConsole.warn;
        if (this.options.catchErrors) window.removeEventListener("error", this.catchErrorFN, false);
        this.active = false;
    }

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

    applyCSS() {
        if (this.style) {
            return;
        }
        this.style = document.createElement("style"); 
        this.style.append(document.createTextNode(defaultCSS));
        document.head.append(this.style);
    }

    removeCSS() {
        if (!this.style) {
            return;
        }
        this.style.remove();
        this.style = null;
    }

    makeLog(type, args, preventDefaultLog=this.options.preventDefault) {
        const infoAdder = {
            error: "⛔",
            info: "ⓘ",
            warn: "⚠️"
        };

        if (!preventDefaultLog) {
            this.defaultConsole[type](...args);
        }
        if (type !== "log") {
            args.unshift(infoAdder[type]);
            this.addInfo = type; 
        }

        this.logToHTML(type, ...args);
    }

    

    makeTableLog(args, preventDefaultLog=this.options.preventDefault) {
        if (!preventDefaultLog && this.consoleHasTable) {
            this.defaultConsole.table(...args);
        }

        const isIterable = (val) => (typeof val === "object" || (Symbol.iterator in Object(val) && typeof val !== "string"));
        
        let data, cols;
        [data, cols] = args;

        if (!isIterable(data)) {
            this.logToHTML("log", data);
        } 
        
        else {
            if (typeof data !== "object") {
                data = Object.assign({}, data);
            }

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

            let header;
            if (cols.length === 1 && cols[0] == 0) {
                header = ["(Index)", "Value"];
            } else {
                header = ["(Index)", ...cols];
            }

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
            
            this.logHTMLTable(tData, header);
        }
    }

    makeDivLogEntry(className="log") {        
        let log = document.createElement("div");
        log.classList.add("log", className);
        log.dataset.date = new Date().toISOString();
        
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

    makeEntrySpan(CSSClass, content) {
        const span = document.createElement("span");
        span.classList.add(CSSClass);
        span.textContent = content;
        return span;
    }

    analyzeInputMakeSpan(arg, argType, newLog) {
        if (argType === "object") {
            if (Array.isArray(arg) || (ArrayBuffer.isView(arg) && (arg.constructor.name.match("Array")))) {
                const lastIndex = arg.length - 1;
                newLog.append(this.makeEntrySpan("object", `${arg.constructor.name} [ `));
                
                arg.forEach((subArg, i) => {
                    let subType = typeof subArg;
                    if (subType === "string") {
                        subArg = `"${subArg}"`;
                        subType = "array-string";
                        newLog.append(this.makeEntrySpan(subType, subArg));
                    }

                    else {
                        this.analyzeInputMakeSpan(subArg, subType, newLog);
                    }
                    
                    if (i < lastIndex) {
                        newLog.append(this.makeEntrySpan("object", ", "));
                    }
                });

                newLog.append(this.makeEntrySpan("object", " ]"));
            }

            else if (ArrayBuffer.isView(arg)) {
                newLog.append(this.makeEntrySpan("object", "DataView { buffer: ArrayBuffer, byteLength: "));
                newLog.append(this.makeEntrySpan("number", arg.byteLength));
                newLog.append(this.makeEntrySpan("object", ", byteOffset: "));
                newLog.append(this.makeEntrySpan("number", arg.byteOffset));
                newLog.append(this.makeEntrySpan("object", " }"));
            }

            else if (arg === null) {
                newLog.append(this.makeEntrySpan("null", "null"));
            }
            
            else if (arg.constructor.name === "ArrayBuffer") {
                newLog.append(this.makeEntrySpan("object", "ArrayBuffer { byteLength: "));
                newLog.append(this.makeEntrySpan("number", arg.byteLength));
                newLog.append(this.makeEntrySpan("object", " }"));
            }

            else if (arg === Object(arg)) {
                newLog.append(this.makeEntrySpan("object", "Object { "));
                
                const objEntries = Object.entries(arg);
                const lastIndex = objEntries.length - 1;
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
                            newLog.append(this.makeEntrySpan(subType, subArg));
                        }

                        else {
                            this.analyzeInputMakeSpan(subArg, subType, newLog);
                        }

                        if (!j) {
                            newLog.append(this.makeEntrySpan("object", ": "));
                        }
                    });
                    
                    if (i < lastIndex) {
                        newLog.append(this.makeEntrySpan("object", ", "));
                    }
                });
                newLog.append(this.makeEntrySpan("object", " }"));
            }
            
            else {
                this.defaultConsole.error("You found an edge case, which is not covered yet.\nPlease create an issue mentioning your input at:\nhttps://github.com/UmamiAppearance/HTMLConsole/issues");
                newLog.append(this.makeEntrySpan("string", arg));
            }
        }

        else if (argType === "function") {
            // cf. https://stackoverflow.com/a/31194949
            let fnStr = Function.toString.call(arg);
            const isClass = Boolean(fnStr.match(/^class/));
            let hasConstructor = true;
            let paramArray;
            
            if (fnStr.match("=>")) {
                paramArray = fnStr
                    .replace(/\s+/g, "")                        // remove all whitespace
                    .replace(/=>.*/, "")                        // remove everything after the arrow
                    .replace(/(\(|\))/g, "")                    // remove brackets
                    .split(",")                                 // split parameters
                    .filter(Boolean);                           // filter [""]
            }
            
            else if (isClass && !fnStr.match("constructor")) {
                hasConstructor = false;
                paramArray = [];
            }
            
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
 
            const params = paramArray.join(", ");
            
            if (isClass) {
                if (hasConstructor) {
                    newLog.append(this.makeEntrySpan("function", `class ${arg.name} { constructor(`));
                    newLog.append(this.makeEntrySpan("fn-args", params));
                    newLog.append(this.makeEntrySpan("function", ") }"));
                } else {
                    newLog.append(this.makeEntrySpan("function", `class ${arg.name} {}`));
                }
            } else {
                newLog.append(this.makeEntrySpan("function", `function ${arg.name}(`));
                newLog.append(this.makeEntrySpan("fn-args", params));
                newLog.append(this.makeEntrySpan("function", ")"));
            }
        }

        else if (argType === "undefined") {
            newLog.append(this.makeEntrySpan("null", "undefined"));
        }

        
        else {
            if (argType === "string") {
                if (arg === "") {
                    arg = "<empty string>";
                }
                // pass
            }
            
            else if (argType === "bigint") {
                arg += "n";
            }
            
            else if (argType === "symbol") {
                arg = arg.toString().replace("(", "(\"").replace(")", "\")");
            }
            
            else if (isNaN(arg)) {
                argType = "null";
            }
            newLog.append(this.makeEntrySpan(argType, arg));
        }
    }

    logToHTML(type, ...args) {
        const newLog = this.makeDivLogEntry(type);
        const start = (type === "log") ? 0 : 1;
        const last = args.length-1;

        if (start === 1) {
            newLog.append(this.makeEntrySpan("info", args[0]));
            newLog.append(this.makeEntrySpan("space", " "));
        }

        if (last < 0) {
            newLog.append(this.makeEntrySpan("space", " "));
        }  else {
            for (let i=start; i<=last; i++) {
                let argType = typeof args[i];

                this.analyzeInputMakeSpan(args[i], argType, newLog);

                if (i !== last) {
                    newLog.append(this.makeEntrySpan("space", " "));
                }
            }
        }

        newLog.scrollIntoView();
    }


    logHTMLTable(data, header) {
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


        let divLog = this.makeDivLogEntry();
        divLog.append(table);

        table.scrollIntoView();
    }

    #makeLabelStr(label) {
        if (typeof label === "undefined") {
            label = "default";
        } else {
            label = String(label);
        }
        return label;
    }

    assert(bool, args) {
        if (!this.preventDefault) {
            this.defaultConsole.assert(bool, ...args);
        }
        if (!bool) {
            this.makeLog("error", ["Assertion failed:", ...args], true);
        }
    }

    count(label) {
        label = this.#makeLabelStr(label);

        if (!this.counters[label]) {
            this.counters[label] = 1;
        } else {
            this.counters[label] ++;
        }
        this.makeLog("log", [`${label}: ${this.counters[label]}`]);
    }

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

    clear() {
        if (!this.preventDefault) {
            this.defaultConsole.clear();
        }
        this.mainElem.innerHTML = "";
        this.logCount = 0;
        this.makeLog("log", ["Console was cleared"], true);
    }

    debug(args) {
        if (!this.preventDefault) {
            this.defaultConsole.debug(...args);
        }
        if (this.options.showDebugging) {
            this.makeLog("log", args, true);
        }
    }

    time(label) {
        const now = window.performance.now();
        label = this.#makeLabelStr(label);

        if (!this.timers[label]) {
            this.timers[label] = now;
        } else {
            const msg = `Timer '${label}' already exists`;
            this.makeLog("warn", [msg], true);

            if (!this.preventDefault) {
                this.defaultConsole.warn(msg);
            }
        }
    }

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
        if (!this.preventDefault) {
            this.defaultConsole[type](msg);
        }
        
        return label;
    }

    timeEnd(label) {
        label = this.#timeLogEnd(label);
        delete this.timers[label];
    }

    timeLog(label) {
        this.#timeLogEnd(label);
    }

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
        const newLog = this.makeDivLogEntry();
        newLog.append(this.makeEntrySpan("trace-head", "console.trace()"));

        for (const arg of args) {
            newLog.append(this.makeEntrySpan("space", " "));
            this.analyzeInputMakeSpan(arg, typeof arg, newLog);
        }

        newLog.append("\n");

        for (const line of stackArr) {
            newLog.append(this.makeEntrySpan("space", "  "));
            newLog.append(this.makeEntrySpan("trace-name", line.name));
            newLog.append(this.makeEntrySpan("space", " ".repeat(lenLeft-line.len)));
            newLog.append(this.makeEntrySpan("trace-file", line.file));
            newLog.append("\n");
        }

        newLog.scrollIntoView();
        
        // default console trace
        if (!this.preventDefault) {
            const msg = ["%cconsole.trace()", "color:magenta;", ...args, "\n"];
            
            for (const line of stackArr) {
                msg.push(`  ${line.name}${" ".repeat(lenLeft-line.len)}${line.file}\n`);
            }

            this.defaultConsole.log(...msg);
        }
    }
}

export { HTMLConsole };
