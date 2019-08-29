const express = require("express");
const cors = require("cors");
const {
  initDatabase,
  getProducts,
  saveProduct,
  registerUser,
  getGoogleUser,
  updateUser,
} = require("./db/mongo.js");
const { verifyGoogleToken } = require("./auth");

const app = express();
app.use(cors());
app.use(express.json());

initDatabase();

app.get("/", (req, res, next) => {
  res.sendStatus(200);
});

app.post("/products/", (req, res, next) => {
  saveProduct(req.body)
    .then(product => {
      res.json(product);
    })
    .catch(err => {
      next(err);
    });
});

app.get("/products/", (req, res, next) => {
  getProducts().then(products => {
    res.json(products);
  });
});

app.post("/tokensignin", (req, res, next) => {
  const token = req.body.token;
  verifyGoogleToken(token).then(payload => {
    const userGoogleId = payload.sub;
    getGoogleUser(userGoogleId).then(user => {
      if (user) {
        res.send({
          id: user._id,
          name: user.name,
          email: user.email,
          favorites: user.favorites,
        });
      } else {
        registerUser({
          name: payload.name,
          email: payload.email,
          favorites: [],
          googleId: userGoogleId,
        }).then(regUser => {
          res.send({
            id: regUser._id,
            name: regUser.name,
            email: regUser.email,
            favorites: regUser.favorites,
          });
        });
      }
    });
  });
});

app.put("/users/:id", (req, res, next) => {
  updateUser(req.params.id, req.body).then(success => {
    res.send(success);
  });
});

const portnr = 8081;
app.listen(portnr, () => {
  console.log(`Server listening on port: ${portnr}`);
});
