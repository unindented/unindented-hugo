import { createReadStream } from "fs";
import { createServer } from "http";
import { dirname, join as joinPath, resolve as resolvePath } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basePath = resolvePath(__dirname, "../public");

export default (callback) => {
  const server = createServer(({ url }, res) => {
    const filePath = joinPath(basePath, url.endsWith("/") ? `${url}/index.html` : url);
    const stream = createReadStream(filePath);
    stream.on("error", () => {
      res.writeHead(404);
      res.end();
    });
    stream.pipe(res);
  });

  server.listen(async () => {
    const { port } = server.address();

    console.log(`Started a web server on port ${port}...`);

    process.exitCode = (await callback({ port })) ? 0 : 1;

    server.close();
  });
};
