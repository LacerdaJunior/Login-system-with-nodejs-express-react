import "dotenv/config";
import express from "express";
import cors from "cors";

import routes from "./routes/routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(4949, () => {
  console.log("Server listening on 4949");
});
