import express from 'express';
import { signin, signup } from '../controllers/auth.controller.js';
// import { google, signin, signup } from '../controllers/auth.controller.js';//previous one

const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
// router.post('/google', google)

export default router;