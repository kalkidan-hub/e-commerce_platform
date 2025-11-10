class Order {
  constructor({ id, userId, description, totalPrice, status, products = [] }) {
    this.id = id;
    this.userId = userId;
    this.description = description;
    this.totalPrice = totalPrice;
    this.status = status;
    this.products = products;
  }
}

module.exports = Order;

