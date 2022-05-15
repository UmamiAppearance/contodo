/**
 * Mirror console logs into a code tag.
 *
 * Based on:
 * https://gist.githubusercontent.com/axelpale/27c9c216116bd591b1b89c0c91dd62a0/raw/fa6fc8d3825d70936213b57d1bb96e01c74727d8/ghoulog.js
 */ 
class HTMLog {

    constructor(node, options={}) {
        
        this.parentNode = (node) ? node : document.body;

        this.options = {
            autostart: (options.autostart) ? Boolean(options.autostart) : true,
            height: (options.height) ? options.height : "inherit",
            maxEntries: (options.maxEntries) ? Math.max(parseInt(Number(options.maxEntries), 10), 0) : 0,
            name: (options.name) ? options.name : "html-console",
            preventDefault: (options.preventDefault) ? Boolean(options.preventDefault) : false,
            reversed: (options.reversed) ? Boolean(options.reversed) : false,
            style: (options.style) ? options.style : "default",
            width: (options.width) ? options.width : "inherit"
        }
        
        this.defaultConsole = {
            log: console.log.bind(console),
            error: console.error.bind(console),
            warn: console.warn.bind(console),
            table: console.table ? console.table.bind(console) : null
        }
   
        this.active = false;
        this.consoleHasTable = (typeof this.defaultConsole.table === "function");
        this.mainElem = null;
        this.style = null;

        this.catchErrorFN = this.catchErrorFN.bind(this);

        if (this.options.autostart) {
            this.createDocumentNode();
            this.initFunctions();
        }
    }

    createDocumentNode() {
        if (!this.mainElem) {
            this.mainElem = document.createElement("code");
            this.mainElem.id = this.options.name;
            this.parentNode.append(this.mainElem);
            this.mainElem.classList.add(this.options.name);
            this.mainElem.classList.add(this.options.style);
            this.mainElem.style.height = this.options.height;
            this.logCount = 0;
        }
        this.applyCSS();
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
        console.log = (...args) => this.makeLog("log", args);
        console.error = (...args) => this.makeLog("error", args);    
        console.warn = (...args) => this.makeLog("warn", args);
        console.table = (...args) => this.makeTableLog(args);
        window.addEventListener("error", this.catchErrorFN, false);
        this.active = true;
    }

    restoreDefaultConsole() {
        if (!this.active) {
            return;
        }
        console.log = this.defaultConsole.log;
        console.error = this.defaultConsole.error;
        console.warn = this.defaultConsole.warn;
        console.table = this.defaultConsole.table;
        window.removeEventListener("error", this.catchErrorFN, false);
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
        const css = CSS.replaceAll("OPTIONS_NAME", this.options.name); 
        this.style.append(document.createTextNode(css));
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
            error: "🚫",
            warn: "⚠️"
        }

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

        const isIterable = (val) => (typeof val === 'object' || (Symbol.iterator in Object(val) && typeof val !== "string"));
        
        let data, cols;
        [data, cols] = args;

        if (!isIterable(data)) {
            this.logToHTML("log", data);
        } 
        
        else {
            const rows = Object.keys(data);
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

    makeArgSpan(CSSClass, content) {
        const span = document.createElement("span");
        span.classList.add(CSSClass);
        span.textContent = content 
        return span;
    }

    analyzeInputMakeSpan(arg, argType, newLog) {
        if (argType === "object") {
            if (Array.isArray(arg) || (ArrayBuffer.isView(arg) && (arg.constructor.name.match("Array")))) {
                const lastIndex = arg.length - 1;
                newLog.append(this.makeArgSpan("object", `${arg.constructor.name} [ `));
                
                arg.forEach((subArg, i) => {
                    let subType = typeof subArg;
                    if (subType === "string") {
                        subArg = `"${subArg}"`;
                        subType = "array-string";
                        newLog.append(this.makeArgSpan(subType, subArg));
                    }

                    else {
                        this.analyzeInputMakeSpan(subArg, subType, newLog);
                    }
                    
                    if (i < lastIndex) {
                        newLog.append(this.makeArgSpan("object", ", "));
                    }
                });

                newLog.append(this.makeArgSpan("object", " ]"));
            }

            else if (ArrayBuffer.isView(arg)) {
                newLog.append(this.makeArgSpan("object", "DataView { buffer: ArrayBuffer, byteLength: "));
                newLog.append(this.makeArgSpan("number", arg.byteLength));
                newLog.append(this.makeArgSpan("object", ", byteOffset: "));
                newLog.append(this.makeArgSpan("number", arg.byteOffset));
                newLog.append(this.makeArgSpan("object", " }"));
            }

            else if (arg === null) {
                newLog.append(this.makeArgSpan("null", "null"));
            }
            
            else if (arg.constructor.name === "ArrayBuffer") {
                newLog.append(this.makeArgSpan("object", "ArrayBuffer { byteLength: "));
                newLog.append(this.makeArgSpan("number", arg.byteLength));
                newLog.append(this.makeArgSpan("object", " }"));
            }
        }

        else if (argType === "function") {
            // https://stackoverflow.com/a/31194949
            const fnStr = Function.toString.call(arg);
            const params = fnStr
                .replace(/\/\/.*$/mg,'')
                .replace(/\s+/g, '')
                .replace(/\/\*[^/*]*\*\//g, '')  
                .split('){', 1)[0].replace(/^[^(]*\(/, '')  
                .replace(/=[^,]+/g, '')  
                .split(',').filter(Boolean)
                .join(", ");
            this.defaultConsole.log("params", params);
            if (fnStr.match(/^class/)) {
                newLog.append(this.makeArgSpan("function", `class ${arg.name} { constructor(`));
                newLog.append(this.makeArgSpan("fn-args", params));
                newLog.append(this.makeArgSpan("function", ") }"));
            } else {
                newLog.append(this.makeArgSpan("function", `function ${arg.name}(`));
                newLog.append(this.makeArgSpan("fn-args", params));
                newLog.append(this.makeArgSpan("function", ")"));
            }
        }

        else if (argType === "undefined") {
            newLog.append(this.makeArgSpan("null", "undefined"));
        }

        
        else {
            if (argType === "string" && arg === "") {
                arg = "<empty string>";
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
            newLog.append(this.makeArgSpan(argType, arg));
        }
    }

    logToHTML(type, ...args) {
        const newLog = this.makeDivLogEntry(type);
        const start = (type === "log") ? 0 : 1;
        const last = args.length-1;

        if (start === 1) {
            newLog.append(this.makeArgSpan("info", args[0]));
            newLog.append(this.makeArgSpan("space", " "));
        }

        for (let i=start; i<=last; i++) {
            let argType = typeof args[i];

            this.analyzeInputMakeSpan(args[i], argType, newLog);

            if (i !== last) {
                newLog.append(this.makeArgSpan("space", " "));
            }

            newLog.scrollIntoView();
        }
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
}

const CSS = `
.OPTIONS_NAME {
    position: inherit;
    display: block;
    font-family: monospace;
    font-size: inherit;
    min-width: 100px;
    min-height: 100px;
    white-space: break-spaces;
    overflow: auto;
    margin: auto;
}
.OPTIONS_NAME.default > .log {
    border-color: rgba(157, 157, 157, 0.2);
    border-width: 0 0 1pt 0;
    border-style: solid;
    padding: 2px 5px;
}
.OPTIONS_NAME.default > .log:first-child {
    border-width: 1pt 0;
}
.OPTIONS_NAME.default > .warn {
    background-color: rgb(248, 255, 147);
}
.OPTIONS_NAME.default > .warn > span {
    color: rgb(80, 80, 0) !important;
}
.OPTIONS_NAME.default > .error {
    background-color: rgb(236, 143, 143);
}
.OPTIONS_NAME.default > .error > span {
    color: rgb(100, 0, 0) !important;
}
.OPTIONS_NAME.default > .log > .null {
    color: rgb(127, 127, 127);
}
.OPTIONS_NAME.default > .log > .number, .OPTIONS_NAME.default > .log > .bigint, .OPTIONS_NAME.default > .log > .object, .OPTIONS_NAME.default > .log > .boolean {
    color: rgb(50, 150, 60);
}
.OPTIONS_NAME.default > .log > .array-string, .OPTIONS_NAME.default > .log > .fn-args, .OPTIONS_NAME.default > .log > .symbol {
    color: rgb(255, 0, 255);
}
.OPTIONS_NAME.default > .log > .function, .OPTIONS_NAME.default > .log > .object {
    color: rgb(40, 100, 250);
}
.OPTIONS_NAME.default table {
    width: 100%;
    text-align: right;
    border-spacing: 0;
    border-collapse: collapse;
    border: 2px #333;
    border-style: solid none;
}
.OPTIONS_NAME.default thead, .OPTIONS_NAME.default th {
    font-weight: 700;
}
.OPTIONS_NAME.default thead > tr, .OPTIONS_NAME.default tr:nth-child(even) {
    background-color: rgba(200, 200, 220, 0.1);
}
.OPTIONS_NAME.default th, .OPTIONS_NAME.default td {
    padding: 3px 0;
    border: 1px solid rgba(157, 157, 157, 0.2);
}
`
