const BaseResponse = require('../../../application/dtos/BaseResponse');

class AuthController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  async register(req, res, next) {
    try {
      const { username, email, password, role } = req.body;

      const user = await this.registerUserUseCase.execute({ username, email, password, role });

      const response = new BaseResponse({
        success: true,
        message: 'User registered successfully',
        object: user,
        errors: null,
      });

      return res.status(201).json(response);
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await this.loginUserUseCase.execute({ email, password });

      const response = new BaseResponse({
        success: true,
        message: 'Login successful',
        object: result,
        errors: null,
      });

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AuthController;

