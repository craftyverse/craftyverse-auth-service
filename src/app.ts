import express from "express";
import cors from "cors";
import { logger, logEvents } from "./middleware/log-events";
import { corsOptions } from "../config/cors-options";
import {
  NotFoundError,
  errorHandler,
} from "@craftyverse-au/craftyverse-common";
import { v1AuthenticationRouter } from "./v1/routes/authentication-routes";

const app = express();

const PORT = 3000;

// Custom logger
app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/users/v1/authentication", v1AuthenticationRouter);

app.all("*", () => {
  const message = "The route that you have requested does not exist";
  throw new NotFoundError(message);
});

app.use(errorHandler);

export { app };
