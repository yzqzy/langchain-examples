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
const Animals = [
  {
    name: 'cat',
    footLength: 123
  },
  {
    name: 'dog',
    footLength: 123,
    wingLength: 457,
    wing: false
  }
]

export const resolvers = {
  Query: {
    books: () => Books,
    book: (_, args) => {
      return Books.find(book => book.id === args.id)
    },

    authors: () => Authors,

    animals: () => {
      return Animals
    }
  },
  Book: {
    author: parent => {
      return Authors.find(author => author.id === parent.author)
    }
  },
  Animal: {
    __resolveType(data) {
      if (data.wingLength) {
        return 'Bird'
      }
      return 'Spider'
    }
  }
}
