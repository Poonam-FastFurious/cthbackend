import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import adminrouter from "../src/Modules/Admin/Admin.routes.js";
import userrouter from "../src/Modules/CTHUser/User.routes.js";
import Banner from "../src/Modules/Banner/Banner.routes.js";
import privacy from "../src/Modules/Privacypolicy/Privacypolicy.routes.js";
import termscondtion from "../src/Modules/TermAndConditions/Termscondition.routes.js";
import blogs from "../src/Modules/Blog/Blog.routes.js";
import Sliders from "../src/Modules/Slider/Slider.routes.js";
import ReturnPolicy from "../src/Modules/ReturnPolicy/ReturnPolicy.routes.js";
import faqs from "../src/Modules/FAQS/Faq.routes.js";
import testimonials from "../src/Modules/Testimonial/Testimonial.routes.js";
import Gallery from "../src/Modules/Gallery/Gallery.routes.js";

//routes declearetion
app.use("/api/v1/admin", adminrouter);
app.use("/api/v1/user", userrouter);
app.use("/api/v1/Banner", Banner);
app.use("/api/v1/privacy", privacy);
app.use("/api/v1/terms", termscondtion);
app.use("/api/v1/blog", blogs);
app.use("/api/v1/slider", Sliders);
app.use("/api/v1/Returnpolicy", ReturnPolicy);
app.use("/api/v1/faq", faqs);
app.use("/api/v1/testimonial", testimonials);
app.use("/api/v1/gallery", Gallery);

export { app };
