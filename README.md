# Create a new user
mutation {
  createUser(userInput: {
    email: "test@example.com",
    name: "Test User",
    phone: "987876765"
  }) {
    email
    name
    phone
  }
}

# Retrieve all users
query {
  getUsers {
    _id
    name
    email
  }
}

# Update an existing user
mutation {
  updateUser(id:"666b4a819524ca344311e91c", userInput: {
    email: "exp@mail.com",
    name: "express",
    phone: "987876765"
  }) {
    name
    email
    phone
  }
}

# Delete a user
mutation {
  deleteUser(id:"666b2950a8cf257fcf3f1efa")
}
