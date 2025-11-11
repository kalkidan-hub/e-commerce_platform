const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const getProductsKey = ({ page, pageSize, search, category, minPrice, maxPrice, inStock }) => {
  const parts = [
    `page=${page}`,
    `size=${pageSize}`,
    `search=${search || ''}`,
    `category=${category || ''}`,
    `min=${minPrice ?? ''}`,
    `max=${maxPrice ?? ''}`,
    `stock=${inStock !== undefined ? inStock : ''}`,
  ];
  return `products:${parts.join('|')}`;
};

const get = (key) => cache.get(key);
const set = (key, value, ttl) => cache.set(key, value, ttl);

const invalidateProductsCache = () => {
  cache.keys().forEach((key) => {
    if (key.startsWith('products:')) {
      cache.del(key);
    }
  });
};

module.exports = {
  getProductsKey,
  get,
  set,
  invalidateProductsCache,
};

