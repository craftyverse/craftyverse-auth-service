import express, { Request, Response } from "express";
import { registerUser } from "../../controllers/authentication/register-user-controller";
import { registerUserSchema } from "../../schemas/register-user-schema";
import { RequestValidationError } from "@craftyverse-au/craftyverse-common";

const router = express.Router();

router.get("/healthCheck", (req: Request, res: Response) => {
  res.status(200).json({
    health: "OK",
  });
});

router.post("/registerUser", registerUser);

router.post("/loginUser", (req: Request, res: Response) => {
  res.status(200).json({
    message: "logged in user",
  });
});

export { router as v1AuthenticationRouter };
