// User:
    // id
    // Recipes
    // Username
    // Email Address
let users =  [
    { 
      id: '1', 
      username: 'johndoe', 
      password: 'password1',
      email: 'johndoe@example.com',
      recipes: [ { id: '1', name: 'Spaghetti Carbonara' }, { id: '6', name: 'Chocolate Cake' } ]
    },
    { 
      id: '2', 
      username: 'janedoe', 
      password: 'password2',
      email: 'janedoe@example.com',
      recipes: [ { id: '2', name: 'Caesar Salad' }, { id: '10', name: 'Mushroom Risotto' } ]
    },
    { 
      id: '3', 
      username: 'bobby',
      password: 'password3', 
      email: 'bobby@example.com',
      recipes: [ { id: '3', name: 'Grilled Chicken' }, { id: '7', name: 'Pancakes' } ]
    },
    { 
      id: '4', 
      username: 'susan',
      password: 'password4', 
      email: 'susan@example.com',
      recipes: [ { id: '4', name: 'Beef Stew' }, { id: '8', name: 'Lentil Soup' } ]
    },
    { 
      id: '5', 
      username: 'markus',
      password: 'password5', 
      email: 'markus@example.com',
      recipes: [ { id: '5', name: 'Vegan Tacos' }, { id: '9', name: 'Tom Yum Soup' } ]
    }
  ];
// Recipes:
    // Id
    // instructions
    // Reviews
    // Status
let recipes = [
    { id: '1', name: 'Spaghetti Carbonara', status: 'published', instructions: 'Cook pasta. Fry pancetta. Mix eggs and cheese. Combine.', poster: users[0] },
    { id: '2', name: 'Caesar Salad', status: 'published', instructions: 'Toss lettuce with croutons, cheese, and dressing.', poster: users[1] },
    { id: '3', name: 'Grilled Chicken', status: 'unpublished', instructions: 'Grill chicken breasts with seasoning and serve with sides.', poster: users[2] },
    { id: '4', name: 'Beef Stew', status: 'published', instructions: 'Cook beef, onions, carrots, and potatoes in broth.', poster: users[3] },
    { id: '5', name: 'Vegan Tacos', status: 'published', instructions: 'Warm tortillas, fill with vegetables and beans, top with salsa.', poster: users[4] },
    { id: '6', name: 'Chocolate Cake', status: 'published', instructions: 'Mix ingredients, bake at 350°F for 30 minutes.', poster: users[0] },
    { id: '7', name: 'Pancakes', status: 'published', instructions: 'Mix batter, cook on griddle, serve with syrup.', poster: users[2] },
    { id: '8', name: 'Lentil Soup', status: 'published', instructions: 'Simmer lentils with vegetables and spices until tender.', poster: users[3] },
    { id: '9', name: 'Tom Yum Soup', status: 'unpublished', instructions: 'Boil broth with lemongrass, lime leaves, and spices, add shrimp.', poster: users[4] },
    { id: '10', name: 'Mushroom Risotto', status: 'published', instructions: 'Sautee mushrooms, cook rice, add broth gradually.', poster: users[1] },
  ];
// Reviews:
    // Rating
    // User (reviewer)
    // Description
    // Recipe
let reviews = [
    { id: '1', rating: 5, description: 'Amazing recipe, really enjoyed it!', poster: users[1], recipe: recipes[0] },
    { id: '2', rating: 4, description: 'Very good, but a little salty.', poster: users[0], recipe: recipes[1] },
    { id: '3', rating: 3, description: 'It was okay. Needs more seasoning.', poster: users[2], recipe: recipes[2] },
    { id: '4', rating: 5, description: 'The best beef stew I have ever had!', poster: users[3], recipe: recipes[3] },
    { id: '5', rating: 4, description: 'Loved these tacos, though I added more salsa.', poster: users[4], recipe: recipes[4] },
    { id: '6', rating: 5, description: 'Delicious chocolate cake! Perfect for birthdays.', poster: users[0], recipe: recipes[5] },
    { id: '7', rating: 2, description: 'Pancakes turned out a little too flat.', poster: users[1], recipe: recipes[6] },
    { id: '8', rating: 5, description: 'So hearty and flavorful. Perfect for cold days.', poster: users[2], recipe: recipes[7] },
    { id: '9', rating: 3, description: 'Not a fan of the spice mix.', poster: users[3], recipe: recipes[8] },
    { id: '10', rating: 4, description: 'Rich and creamy, but a bit too much butter.', poster: users[4], recipe: recipes[9] },
    { id: '11', rating: 5, description: 'Great balance of flavors. Will make again.', poster: users[0], recipe: recipes[1] },
    { id: '12', rating: 4, description: 'Simple yet tasty. I added a few extra veggies.', poster: users[1], recipe: recipes[2] },
    { id: '13', rating: 5, description: 'Perfect recipe, everyone loved it.', poster: users[2], recipe: recipes[5] },
    { id: '14', rating: 4, description: 'The soup was delicious, but a bit too spicy for me.', poster: users[3], recipe: recipes[8] },
    { id: '15', rating: 5, description: 'A wonderful dish! Very comforting.', poster: users[4], recipe: recipes[7] },
  ];

export default (users, recipes, reviews)