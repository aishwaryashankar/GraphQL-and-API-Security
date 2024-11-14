export const typeDefs = `#graphql

type User {
    id: ID!
    username: String!
    password: String!
    email: String! 
}


type Recipe {
    id: ID!
    name: String!
    poster: User!
    status: String!
    reviews: [Review!]
    instructions: String!
   
}


type Review {
    id: ID!
    rating: Int!
    user: User!
    description: String!
    recipe: Recipe!
}


type Query {
    users: [User]
    recipes: [Recipe]
    reviews: [Review]

    user(id: ID!): User
    recipe(id: ID!): Recipe
    review(id: ID!): Review
}



`