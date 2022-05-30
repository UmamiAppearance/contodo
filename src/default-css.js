const defaultCSS = `
.contodo {
    position: inherit;
    display: block;
    font-family: monospace;
    font-size: inherit;
    min-width: 100px;
    min-height: 100px;
    white-space: break-spaces;
    overflow: auto;
    margin: auto;
    background-color: #fff;
    color: black;
    padding: 1px;
}
.contodo.default > .log {
    border-color: rgba(157, 157, 157, 0.2);
    border-width: 0 0 1pt 0;
    border-style: solid;
    padding: 2px 5px;
}
.contodo.default > .log:first-child {
    border-width: 1pt 0;
}
.contodo.default > .warn {
    background-color: rgb(250, 250, 180);
}
.contodo.default > .warn > span.string {
    color: rgb(80, 80, 0);
}
.contodo.default > .error {
    background-color: rgb(240, 200, 200);
}
.contodo.default > .error > span.string {
    color: rgb(100, 0, 0);
}
.contodo.default .time {
    opacity: 0.5;
    font-size: 80%;
}
.contodo.default .null {
    color: rgb(127, 127, 127);
}
.contodo.default .number, .contodo.default .bigint, .contodo.default .object, .contodo.default .boolean {
    color: rgb(50, 150, 60);
}
.contodo.default .array-string, .contodo.default .fn-args, .contodo.default .symbol, .contodo.default .trace-head {
    color: rgb(255, 0, 255);
}
.contodo.default .function, .contodo.default .object, .contodo.default .trace-file {
    color: rgb(40, 100, 250);
}
.contodo.default table {
    width: 100%;
    text-align: left;
    border-spacing: 0;
    border-collapse: collapse;
    border: 2px #333;
    border-style: solid none;
}
.contodo.default thead, .contodo.default th {
    font-weight: 700;
}
.contodo.default thead > tr, .contodo.default tr:nth-child(even) {
    background-color: rgba(200, 200, 220, 0.1);
}
.contodo.default th, .contodo.default td {
    padding: 3px 0;
    border: 1px solid rgba(157, 157, 157, 0.2);
    width: 1%;
}
`;

export default defaultCSS;


