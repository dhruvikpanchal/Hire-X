import dotenv from "dotenv"
import connectDB from "./db/db.js";
import dns from "dns"
import { app } from './app.js'
dns.setServers(["1.1.1.1", "8.8.8.8"])

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.log("Mongodb connection error", err)
    })
