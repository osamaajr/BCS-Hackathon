import { createApp } from "./app";

const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "127.0.0.1";
const app = createApp();

app.listen(port, host, () => {
  console.log(`Nura backend listening on http://${host}:${port}`);
});
