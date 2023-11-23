import express, { Request, Response } from "express";

const router = express.Router();

router.get("/:id", (req: Request, res: Response) => {
  res.status(200).json({
    message: "User Management",
    id: req.params.id,
  });
});

router.post("/createUser", (req: Request, res: Response) => {
  res.status(200).json({
    message: "User Management",
  });
});

router.patch("/updateUserFields", (req: Request, res: Response) => {
  res.status(200).json({
    message: "User Management",
  });
});

router.delete("/deleteUser", (req: Request, res: Response) => {
  res.status(200).json({
    message: "User Management",
  });
});

export { router as v1UserManagementRouter };
