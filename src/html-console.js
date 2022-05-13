const MAIN_ELEMENT_NAME = "html-console";

/**
 * Mirror console logs into a code tag.
 *
 * Based on:
 * https://gist.githubusercontent.com/axelpale/27c9c216116bd591b1b89c0c91dd62a0/raw/fa6fc8d3825d70936213b57d1bb96e01c74727d8/ghoulog.js
 */ 
class HTMLog {

    constructor(node, options={}) {
        this.options = {
            height: (options.height) ? options.height : "inherit",
            width: (options.width) ? options.width : "inherit",
            maxEntries: (options.maxEntries) ? options.maxEntries : 0,
            reversed: (options.reversed) ? options.reversed : false,
            style: (options.style) ? options.style : "default"  
        }

        this.parentNode = (node) ? node : document.body;
        this.mainElem = this.createMain(MAIN_ELEMENT_NAME, this.options.style);
        this.applyCSS();

        this.mainElem.style.height = options.height;
        
        this.defaultConsole = {
            log: console.log.bind(console),
            error: console.error.bind(console),
            warn: console.warn.bind(console),
            table: console.table ? console.table.bind(console) : null
        }
   
        console.log = (...args) => this.makeLog("log", args);
        console.error = (...args) => this.makeLog("error", args);    
        console.warn = (...args) => this.makeLog("warn", args);
        console.table = (...args) => this.makeTableLog(args);
        this.consoleHasTable = (typeof this.defaultConsole.table === "function");

        this.logCount = 0;

        window.addEventListener("error", (err) => {
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
                true);
        });
    }

    applyCSS() {
        const style = document.createElement("style");
        style.append(document.createTextNode(CSS));
        document.head.append(style);
    }

    createMain(id, style) {
        let mainElem = document.getElementById(id);
        if (!mainElem) {
            mainElem = document.createElement("code");
            mainElem.id = id;
            this.parentNode.append(mainElem);
            mainElem.classList.add(id);
            mainElem.classList.add(style);
        }
        return mainElem;
    }

    makeLog(type, args, preventDefault=false) {
        const infoAdder = {
            error: "🚫",
            warn: "⚠️"
        }

        if (!preventDefault) {
            this.defaultConsole[type](...args);
        }
        if (type !== "log") {
            args.unshift(infoAdder[type]);
            this.addInfo = type; 
        }

        this.printToDiv(type, ...args);
    }

    makeTableLog(args) {
        if (this.consoleHasTable) {
            this.defaultConsole.table(...args);
        }

        const isIterable = (val) => (typeof val === 'object' || (Symbol.iterator in Object(val) && typeof val !== "string"));
        let data, cols;
        [data, cols] = args;

        if (!isIterable(data)) {
            this.printToDiv("log", data);
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
            
            this.printTable(tData, header);
        }
    }

    makeDivEntry(className="log") {        
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
        span.textContent = content.toString().replace(/\n/g, " ");
        return span;
    }

    printToDiv(type, ...args) {
        const newLog = this.makeDivEntry(type);
        const start = (type === "log") ? 0 : 1;
        const last = args.length-1;

        if (start === 1) {
            newLog.append(this.makeArgSpan("info", args[0]));
            newLog.append(this.makeArgSpan("space", " "));
        }

        for (let i=start; i<=last; i++) {
            let argType = typeof args[i];
            
            if (argType === "object") {
                if (Array.isArray(args[i])) {
                    args[i] = "Array []";
                }
            } else if (argType === "bigint") {
                args[i] += "n";
            } 
            if (argType === "string" && args[i] === "\n") {
                newLog.append(document.createTextNode("\n"));
            } else {
                newLog.append(this.makeArgSpan(argType, args[i]));
            }

            if (i !== last) {
                newLog.append(this.makeArgSpan("space", " "));
            }

            newLog.scrollIntoView();
        }
    }


    printTable(data, header) {
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


        let divLog = this.makeDivEntry();
        divLog.append(table);

        table.scrollIntoView();
    }
}

const CSS = `
.${MAIN_ELEMENT_NAME} {
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
.${MAIN_ELEMENT_NAME}.default > .log {
    border-color: rgba(157, 157, 157, 0.2);
    border-width: 0 0 1pt 0;
    border-style: solid;
    padding: 2px 5px;
}
.${MAIN_ELEMENT_NAME}.default > .log:first-child {
    border-width: 1pt 0;
}
.${MAIN_ELEMENT_NAME}.default > .warn {
    background-color: rgb(248, 255, 147);
}
.${MAIN_ELEMENT_NAME}.default > .warn > span {
    color: rgb(80, 80, 0) !important;
}
.${MAIN_ELEMENT_NAME}.default > .error {
    background-color: rgb(236, 143, 143);
}
.${MAIN_ELEMENT_NAME}.default > .error > span {
    color: rgb(100, 0, 0) !important;
}
.${MAIN_ELEMENT_NAME}.default > .log > .number, .${MAIN_ELEMENT_NAME}.default > .log > .bigint, .${MAIN_ELEMENT_NAME}.default > .log > .object {
    color: rgb(50, 150, 60);
} 
.${MAIN_ELEMENT_NAME}.default > .log > .function, .${MAIN_ELEMENT_NAME}.default > .log > .object {
    color: rgb(37, 37, 137);
}
.${MAIN_ELEMENT_NAME}.default table {
    width: 100%;
    text-align: right;
    border-spacing: 0;
    border-collapse: collapse;
    border: 2px #333;
    border-style: solid none;
}
.${MAIN_ELEMENT_NAME}.default thead, .${MAIN_ELEMENT_NAME}.default th {
    font-weight: 700;
}
.${MAIN_ELEMENT_NAME}.default thead > tr, .${MAIN_ELEMENT_NAME}.default tr:nth-child(even) {
    background-color: rgba(200, 200, 220, 0.1);
}
.${MAIN_ELEMENT_NAME}.default th, .${MAIN_ELEMENT_NAME}.default td {
    padding: 3px 0;
    border: 1px solid rgba(157, 157, 157, 0.2);
}
`
