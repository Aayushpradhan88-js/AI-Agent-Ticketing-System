import express from 'express'
import {
    onboardingController,
    onboardingStatus
} from './onboardingController.js';
import {onboarding} from '../../../middlewares/checkOnboarding.js';
import {authenticateUser} from '../../../middlewares/auth.js';

export const onboardingRoute = express.Router();

onboardingRoute.post("/submit", authenticateUser, onboardingController);
onboardingRoute.get("/check", onboarding, onboardingStatus);