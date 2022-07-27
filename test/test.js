import NoBroCote from "no-bro-cote";

const test = new NoBroCote(import.meta.url);

test.addImport("import ConTodo from './dist/contodo.esm.js'");

test.makeUnit(
    "logTest",
    "test",
    () => {
        const logInput = "test";
        // eslint-disable-next-line no-undef
        const contodo = new ConTodo();
        console.log(logInput);
        return contodo.mainElem.childNodes[0].textContent;
    }
);

test.init();
