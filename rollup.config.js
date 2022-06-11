import { terser } from "rollup-plugin-terser";
import { string } from "rollup-plugin-string";
import { manager } from "rollup-plugin-import-manager";

const exports = {
    input: "./src/contodo.js",
    output: [ 
        /*{   
            format: "iife",
            name: "contodo",
            file: "./dist/contodo.iife.js"
        },
        {   
            format: "iife",
            name: "contodo",
            file: "./dist/contodo.iife.min.js",
            plugins: [terser()]
        },*/
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
        manager({
            pattern: "import defaultCSS from \"./default-css.js\";",

        }),
        string({
            // Required to be specified
            include: "**/*.css",
        })
    ]
};

export default exports;
