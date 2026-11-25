import express from "express";
import countryRoutes from "./routes/country.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.use(countryRoutes);

app.use(errorMiddleware);

export default app;