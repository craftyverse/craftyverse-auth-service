import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signup: () => string;
}

let mongoDb: any;
let mongoDbUri: any;

// Before all test suite, create a mock mongodb connection along with
// a connection string
beforeAll(async () => {
  process.env.ACCESS_TOKEN_SECRET = "asfoijea";
  mongoDb = await MongoMemoryServer.create();
  mongoDbUri = mongoDb.getUri();

  await mongoose.connect(mongoDbUri, {});
});

// Before each test, clear existing mongodb collections
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// Close conenction after test suite
afterAll(async () => {
  await mongoDb.stop();
  await mongoose.connection.close();
});

global.signup = () => {
  // Build a JWT payload { id, email }
  const payload = {
    UserInfo: {
      userId: new mongoose.Types.ObjectId().toHexString(),
      userFirstName: "Tony",
      userLastName: "Li",
      userEmail: "tony.li@test.io",
      userRoles: [2001, 5150, 1982],
    },
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!);

  return `Bearer ${token}`;
};
