import { NoBroCote } from "no-bro-cote";

const test = new NoBroCote(import.meta.url);

test.addImport("import { HTMLConsole } from './src/html-console.js'");

test.makeUnit(
    "logTest",
    "test",
    () => {
        // eslint-disable-next-line no-undef
        const htmlConsole = new HTMLConsole();
        console.log(logInput);
        const output = htmlConsole.mainElem.childNodes[0].textContent;
        return output;
    }
);

test.init();
