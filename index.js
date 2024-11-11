import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'



// Data
import db from './db.js'

// TypeDefs
import { typeDefs } from './schema.js'

// Resolvers
const resolvers = {
    Query: {
        users() 
        {
            return db.users
        },
        recipes() 
        {
            return db.recipes
        },
        reviews() 
        {
            return db.reviews
        },
        user(_,args) 
        {
            return db.users.find((user) => user.id = args.id)
        },
        recipe(_,args)
        {
            return db.recipes.find((recipe) => recipe.id = args.id)
        },
        review(_,args)
        {
            return db.reviews.find((review) => review.id = args.id)
        }
    }
}

// Server
const server = new ApolloServer(
    {
        typeDefs,
        resolvers
    }
)
const { url } = await startStandaloneServer(server, {listen: { port: 4000 }})
console.log(`The Apollo Server is up and running at port ${url}`)