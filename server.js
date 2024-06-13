const { buildSchema } = require("graphql"); // Corrected import
const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql"); // Corrected import

const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env.local") });
console.log("MongoDB URL:", process.env.MONGODB_URL);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Define User schema
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
  },
  { timestamps: true }
);

// Define User model
const User = mongoose.model("User", userSchema);

// GraphQL schema
const schema = buildSchema(`
  type User {
    _id: ID
    name: String
    email: String
    phone: String
    createdAt: String
    updatedAt: String
  }

  input UserInput {
    name: String
    email: String
    phone: String
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    createUser(userInput: UserInput!): User!
    updateUser(id: ID!, userInput: UserInput!): User
    deleteUser(id: ID!): Boolean
  }
`);

// Resolvers or root values
const root = {
  getUser: async ({ id }) => await User.findById(id), // Simplified
  getUsers: async () => await User.find(), // Simplified
  createUser: async ({ userInput }) => await User.create(userInput), // Simplified
  updateUser: async ({ id, userInput }) => await User.findByIdAndUpdate(id, userInput, { new: true }), // Simplified
  deleteUser: async ({ id }) => {
    await User.findByIdAndDelete(id);
    return true;
  },
};

// Middleware to parse JSON bodies
const app = express();
app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 3000; // Use default port 3000 if PORT is not defined in environment
app.listen(PORT, () =>
  console.log(`Server ready at http://localhost:${PORT}/graphql`)
);
