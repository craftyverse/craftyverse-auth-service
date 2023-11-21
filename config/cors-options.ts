import { CorsOptions } from "cors";

// cross origin resource sharing
const whiteList = [
  // "https://www.google.com",
  // "http://localhost:8080",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin || whiteList.indexOf(origin) !== 1) {
      callback(null, true);
      // callback(new Error("Not allowed by CORS"));
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

export { corsOptions };
