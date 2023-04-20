const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
}
type Book {
    bookId: String
    authors: [String]
    description: String   
    image: String
    link: String
    title: String
}
type Auth {
    token: ID!
    user: User
}
type Query { 
    me(userId: ID!): User
}
type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, password: String!, email: String!): Auth
    saveBook(authors: [String]!, bookId: String!, description: String, title: String!, image: String, link: String, userId: ID!): User
    removeBook(bookId: String!, userId: ID!): User
}
`

module.exports = typeDefs;