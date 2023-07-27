import { graphql, buildSchema } from 'graphql'

const testCase1 = () => {
  const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

  const rootValue = { hello: () => 'Hello world' }
  const source = '{ hello }'

  graphql({ schema, source, rootValue }).then(response => {
    console.log(response)
  })
}

const App = () => {
  testCase1()
}

App()
