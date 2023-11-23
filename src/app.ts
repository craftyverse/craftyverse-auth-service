import express from "express";
import cors from "cors";
import { logger, logEvents } from "./middleware/log-events";
import { corsOptions } from "../config/cors-options";
import cookieParser from "cookie-parser";
import {
  NotFoundError,
  errorHandler,
} from "@craftyverse-au/craftyverse-common";
import { v1AuthenticationRouter } from "./v1/routes/authentication-routes";
import { v1UserManagementRouter } from "./v1/routes/user-management-routes";
import { verifyJWT } from "./middleware/verify-jwt";

const app = express();

// Custom logger
app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users/v1/authentication", v1AuthenticationRouter);

app.use(verifyJWT);
app.use("/api/users/v1/usermgnt", v1UserManagementRouter);

app.all("*", () => {
  const message = "The route that you have requested does not exist";
  throw new NotFoundError(message);
});

app.use(errorHandler);

export { app };
