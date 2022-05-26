const defaultCSS = `
.html-console {
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
.html-console.default > .log {
    border-color: rgba(157, 157, 157, 0.2);
    border-width: 0 0 1pt 0;
    border-style: solid;
    padding: 2px 5px;
}
.html-console.default > .log:first-child {
    border-width: 1pt 0;
}
.html-console.default > .warn {
    background-color: rgb(250, 250, 180);
}
.html-console.default > .warn > span.string {
    color: rgb(80, 80, 0);
}
.html-console.default > .error {
    background-color: rgb(240, 200, 200);
}
.html-console.default > .error > span.string {
    color: rgb(100, 0, 0);
}
.html-console.default .null {
    color: rgb(127, 127, 127);
}
.html-console.default .number, .html-console.default .bigint, .html-console.default .object, .html-console.default .boolean {
    color: rgb(50, 150, 60);
}
.html-console.default .array-string, .html-console.default .fn-args, .html-console.default .symbol {
    color: rgb(255, 0, 255);
}
.html-console.default .function, .html-console.default .object {
    color: rgb(40, 100, 250);
}
.html-console.default table {
    width: 100%;
    text-align: right;
    border-spacing: 0;
    border-collapse: collapse;
    border: 2px #333;
    border-style: solid none;
}
.html-console.default thead, .html-console.default th {
    font-weight: 700;
}
.html-console.default thead > tr, .html-console.default tr:nth-child(even) {
    background-color: rgba(200, 200, 220, 0.1);
}
.html-console.default th, .html-console.default td {
    padding: 3px 0;
    border: 1px solid rgba(157, 157, 157, 0.2);
}
`;

export default defaultCSS;


