import { terser } from "rollup-plugin-terser";
import { string } from "rollup-plugin-string";
import { importManager } from "rollup-plugin-import-manager";

const output = (subDir="", appendix="") => [
    {   
        format: "iife",
        name: "contodo",
        file: `./dist/${subDir}contodo${appendix}.iife.js`
    },
    {   
        format: "iife",
        name: "contodo",
        file: `./dist/${subDir}contodo${appendix}.iife.min.js`,
        plugins: [terser()]
    },
    {   
        format: "es",
        name: "contodo",
        file: `./dist/${subDir}contodo${appendix}.esm.js`
    },
    {   
        format: "es",
        name: "contodo",
        file: `./dist/${subDir}contodo${appendix}.esm.min.js`,
        plugins: [terser()]
    },
];

const exports = [
    {
        input: "./src/contodo.js",
        output: output(),
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
    },
    {
        input: "./src/contodo.js",
        output: output("no-style/", "-no-style"),
        plugins: [
            importManager({
                units: {
                    module: "default-css",
                    actions: "remove"
                }
            })
        ]
    }
];

export default exports;
