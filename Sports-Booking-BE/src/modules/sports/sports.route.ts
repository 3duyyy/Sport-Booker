import { Router } from "express";
import { SportsController } from "./sports.controller";

const router = Router()

router.get("/", SportsController.getAll)

export const sportsRoutes = router