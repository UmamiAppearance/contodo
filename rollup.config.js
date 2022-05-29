import { terser } from "rollup-plugin-terser";

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
    ]
};

export default exports;
