export const typeDefs = `#grapql
type Book {
  id: ID!
  title: String!
  author: Author
}

type Author {
  id: ID!
  name: String!
  star: Int
}

type Query {
  books: [Book],
  book(id: ID!): Book
  
  authors: [Author],
}
`
