class Order {
  constructor({ id, userId, description, totalPrice, status, products = [], createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.description = description;
    this.totalPrice = totalPrice;
    this.status = status;
    this.products = products;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Order;

