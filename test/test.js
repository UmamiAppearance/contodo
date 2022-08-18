import { test } from "no-bro-cote";

test.addImport("import ConTodo from './dist/contodo.esm.js'");

test.makeUnit(
    "log Test",
    "test output",
    (logInput) => {
        // eslint-disable-next-line no-undef
        const contodo = new ConTodo();
        console.log(logInput);
        return contodo.mainElem.childNodes[0].textContent;
    },
    "test output"
);

test.init();
