const fs = require('fs/promises');
const path = require('path');
const BaseResponse = require('../../../application/dtos/BaseResponse');

class ProductController {
  constructor(createProductUseCase, updateProductUseCase) {
    this.createProductUseCase = createProductUseCase;
    this.updateProductUseCase = updateProductUseCase;
  }

  async create(req, res, next) {
    try {
      const { name, description, price, stock, category } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const product = await this.createProductUseCase.execute({
        name,
        description,
        price,
        stock,
        category,
        userId: req.user.id,
        imageUrl,
      });

      const response = new BaseResponse({
        success: true,
        message: 'Product created successfully',
        object: product,
        errors: null,
      });

      return res.status(201).json(response);
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, stock, category } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      const { product, previousImageUrl } = await this.updateProductUseCase.execute(id, {
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
      });

      if (previousImageUrl) {
        const previousFilename = previousImageUrl.split('/').pop();
        if (previousFilename) {
          const previousPath = path.resolve(__dirname, '../../../../uploads', previousFilename);
          await fs.unlink(previousPath).catch(() => {});
        }
      }

      const response = new BaseResponse({
        success: true,
        message: 'Product updated successfully',
        object: product,
        errors: null,
      });

      return res.status(200).json(response);
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      return next(error);
    }
  }
}

module.exports = ProductController;

