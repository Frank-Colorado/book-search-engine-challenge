const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // This is a query called me that returns a User type.
    me: async (_root, _args, context) => {
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
    Mutation: {
        // This is a mutation called login that returns an Auth type.
        // The email and password are destructured from the args argument.
        login: async (_root, { email, password }) => {
            // Find the user with the email that was passed in
            const userData = await User.findOne({ email });
            // If there is no user with that email
            if (!userData) {
                // Throw an AuthenticationError
                throw new AuthenticationError("Incorrect credentials");
            }
            // If there is a user with that email
            // Check the password using the instance method created in the User model
            const correctPw = await userData.isCorrectPassword(password);
            // If the password is incorrect
            if (!correctPw) {
                // Throw an AuthenticationError
                throw new AuthenticationError("Incorrect credentials");
            }
            // If email and password are correct
            // Sign token using the signToken function imported from auth
            const token = signToken(userData);
            // Return an Auth type that contains the token and user data
            return { token, userData };
        },
        // This is a mutation called addUser that returns an Auth type.
        // The username, email, and password are destructured from the args argument.
        addUser: async (_root, { username, email, password }) => {
            // Create a new user using the username, email, and password arguments
            const userData = await User.create({ username, email, password });
            // Sign token using the signToken function imported from auth
            const token = signToken(userData);
            // Return an Auth type that contains the token and user data
            return { token, userData };
        },
        // This is a mutation called saveBook that returns a User type.
        saveBook: async (_root, args, context) => {
            // If the context contains a user
            if (context.user) {
                // Find the user with the id that was stored in the token
                // And add the book to the user's savedBooks array
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args } },
                    { new: true, runValidators: true }
                );
                // Return the updated user
                return updatedUser;
            }
            // If the context does not contain a user
            // Throw an AuthenticationError
            throw new AuthenticationError("You need to be logged in!");
        },
        


    
};

