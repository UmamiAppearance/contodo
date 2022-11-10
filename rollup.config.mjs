import { importManager } from "rollup-plugin-import-manager";
import { yourFunction } from "rollup-plugin-your-function";
import CleanCSS from "clean-css";
import terser from "@rollup/plugin-terser";


const output = (subDir="", appendix="") => [
    {   
        format: "iife",
        name: "ConTodo",
        file: `./dist/${subDir}contodo${appendix}.iife.js`
    },
    {   
        format: "iife",
        name: "ConTodo",
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
            yourFunction({
                include: "**/*.css",
                fn: source => {
                    const output = new CleanCSS({}).minify(source);
                    return `export default ${JSON.stringify(output.styles)}`;
                },
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
