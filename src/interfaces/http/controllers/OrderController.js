const BaseResponse = require('../../../application/dtos/BaseResponse');

class OrderController {
  constructor(placeOrderUseCase, listUserOrdersUseCase) {
    this.placeOrderUseCase = placeOrderUseCase;
    this.listUserOrdersUseCase = listUserOrdersUseCase;
  }

  async create(req, res, next) {
    try {
      const { items } = req.body;
      const userId = req.user.id;

      const order = await this.placeOrderUseCase.execute({
        userId,
        items,
      });

      const response = new BaseResponse({
        success: true,
        message: 'Order placed successfully',
        object: order,
        errors: null,
      });

      return res.status(201).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async list(req, res, next) {
    try {
      const { page, pageSize, limit } = req.query;
      let parsedPage =
        page !== undefined && page !== null && page !== '' ? Number(page) : undefined;
      if (parsedPage !== undefined && (Number.isNaN(parsedPage) || parsedPage < 1)) {
        parsedPage = undefined;
      }

      let parsedPageSize =
        pageSize !== undefined && pageSize !== null && pageSize !== ''
          ? Number(pageSize)
          : limit !== undefined && limit !== null && limit !== ''
          ? Number(limit)
          : undefined;
      if (parsedPageSize !== undefined && (Number.isNaN(parsedPageSize) || parsedPageSize < 1)) {
        parsedPageSize = undefined;
      }

      const response = await this.listUserOrdersUseCase.execute({
        userId: req.user.id,
        page: parsedPage,
        pageSize: parsedPageSize,
      });

      return res.status(200).json({
        success: response.success,
        message: response.message,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: Math.ceil(response.totalSize / response.pageSize) || 1,
        totalOrders: response.totalSize,
        orders: response.object,
        errors: response.errors,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = OrderController;

