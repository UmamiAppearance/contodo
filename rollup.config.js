import { string } from "rollup-plugin-string";
import { importManager } from "rollup-plugin-import-manager";
import { yourFunction } from "rollup-plugin-your-function";
import CleanCSS from "clean-css";
import { minify } from "terser";

const terser = yourFunction({
    output: true,
    name: "terser",
    fn: async (source, options) => minify(
        source,
        {
            module: (/^esm?$/).test(options.outputOptions.format),
            toplevel: options.outputOptions.format === "cjs",
            sourceMap: true
        }
    )
});


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
        plugins: [terser]
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
        plugins: [terser]
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
                    return output.styles;
                },
            }),
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
