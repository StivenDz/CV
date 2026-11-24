// Generates the CV PDFs with headless Chrome/Edge.
//
//   npm run pdf                                   -> CV-Stiven-Diaz-es.pdf + CV-Stiven-Diaz-en.pdf
//   npm run pdf -- --lang=es                      -> only Spanish
//   npm run pdf -- --query="compact=true"         -> any page query filter (see src/index.js)
//   npm run pdf -- --query="jobs=efletexia,neutica&hide=hobbies" --name=CV-IA
//
// Outputs <name>-<lang>.pdf in the project root. Set CHROME_PATH to use a specific browser.
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { startServer } from "./serve.mjs";

const run = promisify(execFile);
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

const args = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
        const [key, ...value] = arg.replace(/^--/, "").split("=");
        return [key, value.join("=") || "true"];
    })
);

const browserCandidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
].filter(Boolean);

const browser = browserCandidates.find((path) => existsSync(path));
if (!browser) {
    console.error("Chrome/Edge not found. Set CHROME_PATH to the browser executable.");
    process.exit(1);
}

const langs = args.lang ? args.lang.split(",") : ["es", "en"];
const name = args.name ?? "CV-Stiven-Diaz";
const extraQuery = new URLSearchParams(args.query ?? "");

const server = await startServer(0);
const { port } = server.address();

try {
    for (const lang of langs) {
        const query = new URLSearchParams(extraQuery);
        query.set("lang", lang);
        query.set("pdf", "true");
        const url = `http://127.0.0.1:${port}/?${query}`;
        const output = resolve(root, `${name}-${lang}.pdf`);

        await run(browser, [
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            "--virtual-time-budget=10000",
            `--print-to-pdf=${output}`,
            url
        ]);
        console.log(`✔ ${output}  (${url.replace(`http://127.0.0.1:${port}/`, "")})`);
    }
} finally {
    server.close();
}
