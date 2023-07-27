import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const App = async () => {
  const typeDefs = `#grapql
    type Book {
      title: String
      author: String
    }

    type Query {
      books: [Book]
    }
  `

  const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin'
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster'
    }
  ]

  const resolvers = {
    Query: {
      books: () => books
    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  })

  console.log(`🚀 Server ready at ${url}`)
}

App().then(() => console.log('app start'))
