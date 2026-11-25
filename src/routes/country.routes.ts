import { Router } from "express";

import {
  refreshCountriesController,
  getAllCountriesController,
  getCountryByNameController,
  deleteCountryController,
  getStatusController,
  getSummaryImageController,
} from "../controllers/country.controller";

const router = Router();

router.post("/countries/refresh", refreshCountriesController);

router.get("/countries/image", getSummaryImageController);

router.get("/countries", getAllCountriesController);

router.get("/countries/:name", getCountryByNameController);

router.delete("/countries/:name", deleteCountryController);

router.get("/status", getStatusController);

export default router;