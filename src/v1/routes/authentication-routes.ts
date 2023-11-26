import express, { Request, Response } from "express";
import { registeruserHandler } from "../../controllers/authentication/register-user-controller";
import { loginuserHandler } from "../../controllers/authentication/login-user-controller";
import { refreshTokenHandler } from "../../controllers/authentication/refresh-token-controller";
import { logoutHandler } from "../../controllers/authentication/logout-user-controller";

const router = express.Router();

router.get("/healthCheck", (req: Request, res: Response) => {
  res.status(200).json({
    health: "OK",
  });
});

router.post("/registeruser", registeruserHandler);

router.post("/loginuser", loginuserHandler);

router.get("/refreshToken", refreshTokenHandler);

router.get("/logout", logoutHandler);

export { router as v1AuthenticationRouter };
