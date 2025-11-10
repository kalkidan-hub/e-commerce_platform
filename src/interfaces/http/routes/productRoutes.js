const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const ProductController = require('../controllers/ProductController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { createProductValidator, updateProductValidator } = require('../validators/productValidator');
const { createProductUseCase, updateProductUseCase } = require('../../../infrastructure/container');

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../../../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const productController = new ProductController(createProductUseCase, updateProductUseCase);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Product
 *               description:
 *                 type: string
 *                 example: Detailed description of the product.
 *               price:
 *                 type: number
 *                 example: 99.99
 *               stock:
 *                 type: integer
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: Electronics
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  createProductValidator,
  productController.create.bind(productController)
);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product identifier
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  updateProductValidator,
  productController.update.bind(productController)
);

module.exports = router;

