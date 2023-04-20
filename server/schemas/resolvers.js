const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, { userId }) => {
      console.log(userId);
      const user = await User.findOne({ _id: userId });
      return user;
    },
  },
  Mutation: {
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      console.log(user);

      const checkPassword = await user.isCorrectPassword(password);
      console.log(checkPassword);

      if (!checkPassword) {
        throw new AuthenticationError('Password is incorrect');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_, { authors, title, image, link, userId, bookId, description }) => {
      console.log(userId);

      const book = {
        authors,
        title,
        image,
        link,
        bookId,
        description,
      };

      const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );

      console.log(updateUser);
      return updateUser;
    },
    removeBook: async (_, { bookId, userId }) => {
      const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      console.log(updateUser);
      return updateUser;
    },
  },
};

module.exports = resolvers;
