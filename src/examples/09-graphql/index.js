import fs from 'fs'

import { graphql, buildSchema } from 'graphql'
import gql from 'graphql-tag'

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

const testCase2 = () => {
  const query = gql`
    {
      user(id: 5) {
        firstName
        lastName
      }
    }
  `
  console.log(query)
}

const testCase3 = () => {
  const query = gql`
    ${fs.readFileSync('./schema.graphql', 'utf8')}
  `

  const type_definiations = query.definitions.filter(
    item => item.kind === 'ObjectTypeDefinition' && item.name.value !== 'Query'
  )

  // const timerSeries = ty

  while (type_definiations.length) {
    const definitions = type_definiations.shift()

    definitions.fields.forEach(item => {
      const { type } = item

      if (type.kind === 'NamedType' && type.name.value === 'Date') {
        console.log(item)
      }
    })
  }

  // console.log(type_definiations)
}

const App = () => {
  // testCase1()
  // testCase2()
  testCase3()
}

App()
