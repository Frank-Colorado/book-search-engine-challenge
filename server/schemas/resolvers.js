const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // This is a query called me that returns a User type.
    me: async (_parent, _args, context) => {
      // If the user is authenticated
      if (context.user) {
        // Find the user with the id that was stored in the token
        const userData = await User.findById(context.user._id)
          .select("-__v -password")
          .populate("savedBooks");

        // Return the user data
        return userData;
      }
      // If the user is not authenticated
      // Throw an AuthenticationError
      throw new AuthenticationError("Not logged in");
    },
  },
};
