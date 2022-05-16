import { createServer } from "http";
import puppeteer from "puppeteer";
import { readFile } from "fs";


const port = 9999;

const mimeTypes = {
    html: "text/html",
    js: "text/javascript"
};

let socket;

const server = createServer((request, response) => {
    
    let filePath;
    if (request.url === "/") {
        filePath = "./test/test.html";
        console.log("    + opening html test page");
    } else {
        console.log(`    + importing ${request.url.split("/")[2]}`);
        filePath = `.${request.url}`;
    }

    const contentType = mimeTypes[filePath.split(".").pop()];

    readFile(filePath, (error, content) => {
        if (error) {
            console.error(error);
            return 1;
        }
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
        return 0;
    });

});

server.on("connection", (sock) => {
    socket = sock;
    server.once("close", () => {
        socket = null;
    });
});

const terminateServer = async () => {
    if (socket) socket.destroy();
    server.close();
};

async function main() {
    server.listen(port);
    console.log(`- spinning up local http test server at "127.0.0.1:${port}/"`);

    console.log("- running tests:");
    const browser = await puppeteer.launch();
    await browser.createIncognitoBrowserContext({ dumpio: true });
    
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/`);
    console.log("    + running test functions");
    const result = await page.evaluate(() => window.makeTests());
    await browser.close();
    await terminateServer();

    console.log("- finished tests\n- shutting down test server");
    console.log("-------\nresults");

    if (!result.errors) delete result.errorMessages;
    console.log(JSON.stringify(result, null, 4));
    if (result.errors) {
        console.error(`${result.errors} error${(result.errors > 1) ? "s" : ""} occurred!`);
        return 1;
    }
    console.log("Everything seems to work fine.");
    return 0;
}

main().then((exitCode) => process.exit(exitCode));
