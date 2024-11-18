export const typeDefs = `#graphql

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
    users: [User] 
    recipes: [Recipe] 
    reviews: [Review] 

    user(id: ID!): User 
    recipe(id: ID!): Recipe 
    review(id: ID!): Review 

    currentUser: User 
  }



`