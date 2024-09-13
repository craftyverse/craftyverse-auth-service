import { app } from "../app";
import request from "supertest";

describe("Register User Controller", () => {
  it("should return 201 when a user is successfully registered", async () => {
    const response = await request(app)
      .post("/api/users/v1/authentication/registerUser")
      .send({
        userFirstName: "Tony",
        userLastName: "Li",
        userEmail: "litony179@gmail.com",
        userPassword: "Password123!",
        userConfirmPassword: "Password123!",
        isTermsAndConditionsAccepted: true,
        userRoles: [4951625, 9069533],
      });

    expect(response.status).toEqual(201);
  });
});
