import express, { Request, Response } from "express";
import { registeruserHandler } from "../../controllers/register-user-controller";
import { loginuserHandler } from "../../controllers/login-user-controller";
import { refreshTokenHandler } from "../../controllers/refresh-token-controller";
import { logoutHandler } from "../../controllers/logout-user-controller";

const router = express.Router();

router.get("/healthCheck", (req: Request, res: Response) => {
  res.status(200).json({
    health: "OK",
  });
});

router.post("/registeruser", registeruserHandler);

router.post("/loginuser", loginuserHandler);

router.get("/refreshtoken", refreshTokenHandler);

router.get("/logout", logoutHandler);

router.get("/generateotp", (req: Request, res: Response) => {});

router.post("/verifyotp", (req: Request, res: Response) => {});

export { router as v1AuthenticationRouter };
