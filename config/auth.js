/**
 * The Auth configuration will be specified below
 */

const auth = {
  mode: "session",
  token: {
    secret: process.env.AUTH_TOKEN_SECRET,
    options: {
      expiresIn: 1814400 // in seconds (21 days)
    }
  },
  acl: {
    anonymous: "*",
    user: "*",
    institute_admin: "*",
  }
};

export default auth;
