import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { ApolloArmor } from '@escape.tech/graphql-armor';
import { GraphQLError } from 'graphql';




// Data
import db from './db.js'

// TypeDefs
import { typeDefs } from './schema.js'

// Apollo Armor
const armor = new ApolloArmor({ maxDepth: { n: 8 } });

const rateLimitStore = {};

// Max requests per minute per user
const MAX_REQUESTS_PER_MINUTE = 10;

// Rate Limiting Middleware
const rateLimitMiddleware = (userId) => {
    const now = Date.now();
    const windowStart = now - 60 * 1000; // 1 minute window
    const userRateLimit = rateLimitStore[userId] || [];

    // Remove requests that are outside the 1 minute window
    const recentRequests = userRateLimit.filter((timestamp) => timestamp > windowStart);
    
    // If they have exceeded the rate limit, throw an error
    if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
        throw new GraphQLError("Rate limit exceeded. Try again later.");
    }

    // Otherwise, record the current timestamp for this request
    rateLimitStore[userId] = [...recentRequests, now];
};

// Alphanumeric input validator for input validation
const validateAlphanumeric = (input) => {
    const alphanumericPattern = /^[a-zA-Z0-9\s]+$/;
    return alphanumericPattern.test(input);
};

// Resolvers
const resolvers = {
    Query: {
        // retrieve all users
        users(parent, args, context) 
        {
            if (context.user) {
                rateLimitMiddleware(context.user.id);
            }

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
            if (context.user) {
                rateLimitMiddleware(context.user.id);
            }

            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            
            return db.recipes.filter((recipe) => (recipe.user_id === context.user.id || recipe.status === "published"))
            
        },

        // retrieve all recipe reviews
        reviews(parent, args, context) 
        {   
            if (context.user) {
                rateLimitMiddleware(context.user.id);
            }

            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            return db.reviews
        },

        // retrieve a single user based on id
        user(parent,args, context) 
        {   
            if (context.user) {
                rateLimitMiddleware(context.user.id);
            }

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
            if (context.user) {
                rateLimitMiddleware(context.user.id);
            }

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
            if (context.user) {
                rateLimitMiddleware(context.user.id);
            }

            if (!context.user)
            {
                throw new GraphQLError("Error! You are not authenticated.")
            }
            return db.reviews.find((review) => review.id === args.id)
        },

        // retrieve the current authenticated user
        currentUser(parent, args, context)
        {   
            if (context.user) {
                rateLimitMiddleware(context.user.id);
            }

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

    Mutation: {
        // Add a new recipe
        addRecipe(parent, { name, status, instructions }, context) {
            if (context.user) {
                rateLimitMiddleware(context.user.id);
            }

            if (!context.user) {
                throw new GraphQLError("Error! You are not authenticated.");
            }

            // Validate status
            if (status !== "published" && status !== "unpublished") {
                throw new GraphQLError("Error! The status must be 'published' or 'unpublished'.");
            }

            // Validate name
            if (!validateAlphanumeric(name)) {
                throw new GraphQLError("Error! The recipe name must be alphanumeric (letters, digits, and spaces only).");
            }

            // Validate instructions
            if (!validateAlphanumeric(instructions)) {
                throw new GraphQLError("Error! The instructions must be alphanumeric (letters, digits, and spaces only).");
            }

            const newRecipe = {
                id: (db.recipes.length + 1).toString(), // Simple way to generate an ID (you can use UUID or other methods in production)
                name,
                status,
                instructions,
                user_id: context.user.id,
            };

            db.recipes.push(newRecipe);
            return newRecipe;
        },

        async updateRecipe(_, { id, name, status, instructions }, context) {
            // Check if the user is authenticated
            if (context.user) {
                rateLimitMiddleware(context.user.id);
            }

            if (!context.user) {
              throw new GraphQLError("Error! You are not authenticated.");
            }
      
            // Fetch all recipes of the authenticated user
            const userRecipes = db.recipes.filter((recipe) => recipe.user_id === context.user.id);
      
            // Find the recipe to update within the user's recipes
            const recipeToUpdate = userRecipes.find((recipe) => recipe.id === id);
      
      
            // If recipe is not found, throw an error
            if (!recipeToUpdate) {
              throw new GraphQLError("Error! Recipe not found or you are not authorized to update this recipe.");
            }
      
            // Validate the status (must be either 'published' or 'unpublished')
            if (status && !['published', 'unpublished'].includes(status)) {
              throw new GraphQLError("Error! Invalid status. Status must be either 'published' or 'unpublished'.");
            }
      
            // Validate the name 
            if (name && !/^[a-zA-Z0-9\s]+$/.test(name)) {
              throw new GraphQLError("Error! Recipe name must be alphanumeric.");
            }
      
            // Validate instructions 
            if (instructions && !/^[a-zA-Z0-9\s.,!]+$/.test(instructions)) {
              throw new GraphQLError("Error! Instructions must be alphanumeric and may include punctuation.");
            }
      
            // If validation passes, update the recipe
            const updatedRecipe = {
              ...recipeToUpdate,
              name: name || recipeToUpdate.name, 
              status: status || recipeToUpdate.status,
              instructions: instructions || recipeToUpdate.instructions, 
            };
      
            // Update the recipe in the database (simulating DB update here)
            const recipeIndex = db.recipes.findIndex((recipe) => recipe.id === id);
            db.recipes[recipeIndex] = updatedRecipe;
      
            // Return the updated recipe
            return updatedRecipe;
          }
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
        typeDefs,
        resolvers,
        ...armor.protect(),
        introspection: process.env.NODE_ENV !== 'production',
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