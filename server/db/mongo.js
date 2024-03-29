const mongoose = require("mongoose");

const initDatabase = () => {
  mongoose
    .connect("mongodb://mongodb:27017/test", {
      useNewUrlParser: true,
    })
    .then(res => {
      console.log("MongoDB is connected!");
    })
    .catch(err => {
      console.log(err);
    });
};

const Product = mongoose.model("Product", {
  name: { type: String, required: true },
  price: Number,
  discountPrice: Number,
});

const User = mongoose.model("User", {
  name: { type: String, required: true },
  email: { type: String, required: true },
  favorites: { type: Array, default: [] },
  googleId: { type: String, required: true },
});

const getProducts = async () => {
  return Product.find({});
};

const saveProduct = async product => {
  const newProduct = new Product(product);
  return newProduct.save();
};

const getGoogleUser = id => {
  return User.findOne({
    googleId: id,
  });
};

const getUser = id => {
  return User.findById(id);
};

const registerUser = user => {
  const newUser = new User(user);
  return newUser.save();
};

const updateUser = (id, body) => {
  return User.where({ _id: id }).updateOne({
    favorites: body.favorites,
  });
};

module.exports = {
  initDatabase,
  getProducts,
  saveProduct,
  getUser,
  updateUser,
  getGoogleUser,
  registerUser,
};
