import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'



// Data
import db from './db.js'

// TypeDefs
import { typeDefs } from './schema.js'

// Resolvers
const resolvers = {
    Query: {
        // retrieve all users
        users() 
        {
            return db.users
        },

        // retrieve all recipes
        recipes() 
        {
            return db.recipes
        },

        // retrieve all recipe reviews
        reviews() 
        {
            return db.reviews
        },

        // retrieve a single user based on id
        user(_,args) 
        {
            return db.users.find((user) => user.id === args.id)
        },

        // retrieve a single recipe based on id
        recipe(_,args)
        {
            return db.recipes.find((recipe) => recipe.id === args.id)
        },

        // retrieve a single recipe review based on id
        review(_,args)
        {
            return db.reviews.find((review) => review.id === args.id)
        }
    },

    // Given a recipe, find all the reviews for that recipe
    Recipe:
    {
        reviews(parent) 
        {
            return db.reviews.filter((review) => review.recipe_id === parent.id)
        }
    },

    // Given a recipe review, find the recipe it is for and the user who posted the review
    Review: 
    {
        recipe(parent)
        {
            return db.recipes.find((recipe) => recipe.id === parent.recipe_id)
        },
        user(parent)
        {
            return db.users.find((user) => user.id === parent.user_id)
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