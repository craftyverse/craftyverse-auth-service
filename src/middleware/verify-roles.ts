import { NotAuthorisedError } from "@craftyverse-au/craftyverse-common";
import { Request, Response, NextFunction } from "express";

const verifyRoles = (...allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.userRoles) {
      throw new NotAuthorisedError();
    }

    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.userRoles);

    const result = req.userRoles
      .map((roles) => {
        return rolesArray.includes(parseInt(roles));
      })
      .find((result) => result === true);
    if (!result) {
      throw new NotAuthorisedError();
    }

    next();
  };
};

export { verifyRoles };
