import express from 'express'
import multer from 'multer'
import userModel from '../models/user.model.mjs'
import userFiles from '../models/files.model.mjs'
import jwt from 'jsonwebtoken';
import validato, { validationResult } from 'express-validator';

const router = express.Router();

