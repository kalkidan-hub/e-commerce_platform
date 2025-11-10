const { Router } = require('express');

const AuthController = require('../controllers/AuthController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { registerUserUseCase, loginUserUseCase } = require('../../../infrastructure/container');

const router = Router();
const authController = new AuthController(registerUserUseCase, loginUserUseCase);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass!1
 *               role:
 *                 type: string
 *                 enum: [Customer, Admin]
 *                 description: Optional, defaults to Customer
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
router.post('/register', registerValidator, authController.register.bind(authController));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate an existing user and receive a JWT
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass!1
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
router.post('/login', loginValidator, authController.login.bind(authController));

module.exports = router;

