import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { server } from "./app.js"; // Import the server from app.js
import { initializeAdmin } from "./Modules/Admin/Admin.controler.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    console.log("mongoose connected successfully ");
    initializeAdmin();
    server.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
