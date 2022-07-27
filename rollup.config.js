import { terser } from "rollup-plugin-terser";
import { string } from "rollup-plugin-string";
import { importManager } from "rollup-plugin-import-manager";

const exports = {
    input: "./src/contodo.js",
    output: [ 
        {   
            format: "iife",
            name: "contodo",
            file: "./dist/contodo.iife.js"
        },
        {   
            format: "iife",
            name: "contodo",
            file: "./dist/contodo.iife.min.js",
            plugins: [terser()]
        },
        {   
            format: "es",
            name: "contodo",
            file: "./dist/contodo.esm.js"
        },
        {   
            format: "es",
            name: "contodo",
            file: "./dist/contodo.esm.min.js",
            plugins: [terser()]
        },
    ],
    plugins: [
        string({
            include: "**/*.css",
        }),
        importManager({
            units: {
                module: "default-css",
                actions: {
                    select: "module",
                    rename: "../themes/default.css"
                }
            }
        })
    ]
};

export default exports;

//import defaultCSS from "../themes/default.css";
