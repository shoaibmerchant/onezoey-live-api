import { posts_likes_dislikes, user_games } from "../models/index";

/**
 * The Auth configuration will be specified below
 */

const auth = {
  mode: "session",
  acl: {
    anonymous: "*",
    // 'anonymous': ['admins.login', 'meta.types'],
    user: "*"
  }
};

export default auth;
