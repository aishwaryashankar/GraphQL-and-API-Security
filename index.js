import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { ApolloArmor } from '@escape.tech/graphql-armor';
import { GraphQLError } from 'graphql';
import pkg from 'graphql-rate-limit'; // Import the entire module
const { rateLimitDirective, RateLimitDirectiveTypeDefs } = pkg; // Destructure the needed exports



// Data
import db from './db.js'

// TypeDefs
import { typeDefs } from './schema.js'

// Apollo Armor
const armor = new ApolloArmor({ maxDepth: { n: 8 } });

// Resolvers
const resolvers = {
    Query: {
        // retrieve all users
        users(parent, args, context) 
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            return db.users.map((user) => {
                if (user.id !== context.user.id)
                {
                    return {id:user.id, username:user.username,password:"-----",email:user.email}
                    
                }
                return user
            })
        },

        // retrieve all recipes
        recipes(parent, args, context) 
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            
            return db.recipes.filter((recipe) => (recipe.user_id === context.user.id || recipe.status === "published"))
            
        },

        // retrieve all recipe reviews
        reviews(parent, args, context) 
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            return db.reviews
        },

        // retrieve a single user based on id
        user(parent,args, context) 
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            if (context.user.id === args.id)
            {
                return db.users.find((user) => user.id === args.id)
            }
            
            const user = db.users.find((user) => user.id === args.id)
            user.password = "-----"
            return user
            
        },

        // retrieve a single recipe based on id
        recipe(_,args,context)
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            
            const recipe = db.recipes.find((recipe) => recipe.id === args.id)
            if (recipe.user_id === context.user.id || recipe.status === 'published')
            {
                return recipe
            }
            // returning a published recipe in db in case user tries to view someone else's unpublished recipe
            return { id: '0', name: 'Spaghetti Carbonara', status: 'published', instructions: 'Cook pasta. Fry pancetta. Mix eggs and cheese. Combine.', user_id: '0' }
        },

        // retrieve a single recipe review based on id
        review(parent,args,context)
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            return db.reviews.find((review) => review.id === args.id)
        },

        // retrieve the current authenticated user
        currentUser(parent, args, context)
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! No authenticated user!!")
            }
            else
            {
                return context.user
            }
          
        },
    },

    // Given a recipe, find all the reviews for that recipe and the user who posted the recipe
    Recipe:
    {
        reviews(parent, args, context) 
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            return db.reviews.filter((review) => review.recipe_id === parent.id)
        },
        user(parent, args, context)
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! No authenticated user!!")
            }
            const user = db.users.find((user) => user.id === parent.user_id)
            if (context.user.id === user.id)
            {
                return user
            }
            user.password = '-----'
            return user
            //return db.users.find((user) => user.id === parent.user_id)
        }
    },

    // Given a recipe review, find the recipe it is for and the user who posted the review
    Review: 
    {
        recipe(parent, args, context)
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            return db.recipes.find((recipe) => recipe.id === parent.recipe_id)
        },
        user(parent, args, context)
        {
            if (!context.user)
            {
                throw new GraphQLError("Error! No authenticated user!!")
            }
            const user = db.users.find((user) => user.id === parent.user_id)
            if (parent.user_id === context.user.id)
            {
                return user
            }
            user.password = '-----'
            return user

            
        }
    },

    // Given a user, retrieve their recipes and the reviews they have posted
    User:
    {
        recipes(parent, args, context) {
            //console.log("PARENT: ",parent)
            //console.log("CONTEXT: ",context)
            if (!context.user)
            {
                throw new GraphQLError("Error! No authenticated user!!")
            }
            if (context.user.id === parent.id)
            {
                return db.recipes.filter((recipe) => recipe.user_id === parent.id)
            }
            return db.recipes.filter((recipe) => recipe.user_id === parent.id && recipe.status === 'published')
            
        },

        reviews(parent, args, context) {
            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            return db.reviews.filter((review) => review.user_id === parent.id)
        }
    }
}

// Setting Up the Apollo Server and auth mechanism
const server = new ApolloServer(
    {
        typeDefs: [RateLimitDirectiveTypeDefs, typeDefs],
        resolvers,
        schemaDirectives: {
            rateLimit: rateLimitDirective,  // Apply rate limit directive
          },
        ...armor.protect(),
    }
)

const { url } = await startStandaloneServer(server, 
    {
    context: ({ req }) => 
    {
      const credentials = req.headers.authorization
      const [uName, pwd] = credentials.split(' ')
      const user = db.users.find((user) => user.username === uName && user.password === pwd)
      return { user }
    },
    listen: { port: 4000 },
  });
  
console.log(`The Apollo Server is up and running at port ${url}`)