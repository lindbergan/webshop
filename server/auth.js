const { OAuth2Client } = require("google-auth-library");

const client_id =
  "877683964454-ferhtqapjbkjrtrbmefuhif9e5j5i7b2.apps.googleusercontent.com";

const client = new OAuth2Client(client_id);

const verifyGoogleToken = async token => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: client_id,
  });
  const payload = ticket.getPayload();
  return payload;
};

module.exports = {
  verifyGoogleToken,
};
