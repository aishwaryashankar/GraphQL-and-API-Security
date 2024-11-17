export const typeDefs = `#graphql
  # Rate limit directive
  directive @rateLimit(max: Int!, window: Int!) on FIELD_DEFINITION

type User {
    id: ID!
    username: String!
    password: String!
    email: String! 
    recipes: [Recipe!]
    reviews: [Review!]
}


type Recipe {
    id: ID!
    name: String!
    user: User!
    status: String!
    instructions: String!
    reviews: [Review!]
   
}


type Review {
    id: ID!
    rating: Int!
    user: User!
    description: String!
    recipe: Recipe!
}

type Mutation {
    addRecipe(
        name: String!
        status: String!
        instructions: String!
    ): Recipe

    updateRecipe(
        id: ID!
        name: String
        status: String
        instructions: String
    ): Recipe
}

type Query {
    users: [User] @rateLimit(max: 10, window: 60)  # Limit to 10 requests per minute
    recipes: [Recipe] @rateLimit(max: 10, window: 60)  # Limit to 10 requests per minute
    reviews: [Review] @rateLimit(max: 10, window: 60)  # Limit to 10 requests per minute

    user(id: ID!): User @rateLimit(max: 5, window: 60)  # Limit to 5 requests per minute
    recipe(id: ID!): Recipe @rateLimit(max: 5, window: 60)  # Limit to 5 requests per minute
    review(id: ID!): Review @rateLimit(max: 5, window: 60)  # Limit to 5 requests per minute

    currentUser: User @rateLimit(max: 5, window: 60)  # Limit to 5 requests per minute
  }



`