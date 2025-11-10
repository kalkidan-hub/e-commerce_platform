class Product {
  constructor({ id, name, description, price, stock, category, userId }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.userId = userId;
  }
}

module.exports = Product;

