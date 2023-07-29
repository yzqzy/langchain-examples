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

interface Animal {
  name: String
  footLength: Int
}
type Spider implements Animal {
  name: String
  footLength: Int
}
type Bird implements Animal {
  name: String
  footLength: Int
  wingLength: Int
  wing: Boolean
}

type Query {
  books: [Book],
  book(id: ID!): Book,

  authors: [Author],

  animals: [Animal]
}
`
