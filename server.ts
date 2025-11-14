// --------Importações---------
import Express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { env } from "./src/env.config";
import Routing from './src/routing'
// ---------------------------

// -------- App Setup ---------
dotenv.config();
const PORT = process.env.SERVER_PORT;
const app = Express();
app.use(Express.json());
app.use(
  cors({
    origin: env.FRONT_URL,
    credentials: true
  })
);
// ----------------------------

// -------- Routes -----------
app.use('/', Routing)
// ----------------------------

// --------Instantiating Server---------
app.listen(PORT, async () => {
  console.log(`[SERVER] Listening on http://localhost:${PORT}`);
});
// -------------------------------------
