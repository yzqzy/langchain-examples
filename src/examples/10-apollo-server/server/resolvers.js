const Books = [
  {
    id: '1',
    title: 'The Awakening',
    author: '1'
  },
  {
    id: '2',
    title: 'City of Glass',
    author: '2'
  }
]
const Authors = [
  {
    id: '1',
    name: 'Kate Chopin',
    star: 2000
  },
  {
    id: '2',
    name: 'Paul Auster',
    star: 3000
  }
]

export const resolvers = {
  Query: {
    books: () => Books,
    book: (_, args, context) => {
      console.log(context)

      return Books.find(book => book.id === args.id)
    },

    authors: () => Authors
  },
  Book: {
    author: parent => {
      return Authors.find(author => author.id === parent.author)
    }
  }
}
