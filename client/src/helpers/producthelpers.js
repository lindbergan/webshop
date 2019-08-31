function getDiscountPriceIfExists(product) {
  return product.discountPrice !== undefined
    ? parseFloat(parseFloat(product.discountPrice).toFixed(2))
    : parseFloat(parseFloat(product.price).toFixed(2));
};

module.exports = {
  getDiscountPriceIfExists
}