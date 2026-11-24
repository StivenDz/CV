// Minimal static server for the CV (no dependencies).
// Usage: npm start  ->  http://localhost:5500
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".pdf": "application/pdf",
    ".ico": "image/x-icon"
};

export const startServer = (port = 0) => new Promise((resolvePromise) => {
    const server = createServer(async (req, res) => {
        try {
            const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
            let filePath = normalize(join(root, urlPath));
            if (!filePath.startsWith(root)) {
                res.writeHead(403).end();
                return;
            }
            if ((await stat(filePath)).isDirectory()) filePath = join(filePath, "index.html");
            const body = await readFile(filePath);
            res.writeHead(200, {
                "Content-Type": types[extname(filePath).toLowerCase()] ?? "application/octet-stream",
                "Cache-Control": "no-store"
            });
            res.end(body);
        } catch {
            res.writeHead(404).end("Not found");
        }
    });
    server.listen(port, "127.0.0.1", () => resolvePromise(server));
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    const port = Number(process.env.PORT) || 5500;
    await startServer(port);
    console.log(`CV running at http://localhost:${port}`);
}
