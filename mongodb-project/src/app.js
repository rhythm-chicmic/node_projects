import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import healthCheckRoutes from "./routes/healthCheckRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { errorHandler } from "./middlewwares/error.middleware.js"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// Routes

app.use("/api/v1/healthcheck", healthCheckRoutes)
app.use("/api/v1/users",userRoutes)



// app.use(errorHandler);
export { app }