// User:
    // id
    // Recipes
    // Username
    // Email Address
let users =  [
  { 
    id: '1', 
    username: 'johndoe', 
    email: 'johndoe@example.com',
    password: 'johndoe2'
  },
  { 
    id: '2', 
    username: 'janedoe', 
    email: 'janedoe@example.com',
    password: 'janedoe1'
  },
  { 
    id: '3', 
    username: 'bobby', 
    email: 'bobby@example.com',
    password: 'bobbypwd1'
  },
  { 
    id: '4', 
    username: 'susan', 
    email: 'susan@example.com',
    password: 'susanpwd2'
  },
  { 
    id: '5', 
    username: 'markus', 
    email: 'markus@example.com',
    password: 'markuspwd3'
  }
];
// Recipes:
    // Id
    // instructions
    // Status
let recipes = [
    { id: '1', name: 'Spaghetti Carbonara', status: 'published', instructions: 'Cook pasta. Fry pancetta. Mix eggs and cheese. Combine.', user_id: '0' },
    { id: '2', name: 'Caesar Salad', status: 'published', instructions: 'Toss lettuce with croutons, cheese, and dressing.', user_id: '1' },
    { id: '3', name: 'Grilled Chicken', status: 'unpublished', instructions: 'Grill chicken breasts with seasoning and serve with sides.', user_id: '2' },
    { id: '4', name: 'Beef Stew', status: 'published', instructions: 'Cook beef, onions, carrots, and potatoes in broth.', user_id: '3' },
    { id: '5', name: 'Vegan Tacos', status: 'published', instructions: 'Warm tortillas, fill with vegetables and beans, top with salsa.', user_id: '4' },
    { id: '6', name: 'Chocolate Cake', status: 'published', instructions: 'Mix ingredients, bake at 350°F for 30 minutes.', user_id: '0' },
    { id: '7', name: 'Pancakes', status: 'published', instructions: 'Mix batter, cook on griddle, serve with syrup.', user_id: '2' },
    { id: '8', name: 'Lentil Soup', status: 'published', instructions: 'Simmer lentils with vegetables and spices until tender.', user_id: '3' },
    { id: '9', name: 'Tom Yum Soup', status: 'unpublished', instructions: 'Boil broth with lemongrass, lime leaves, and spices, add shrimp.', user_id: '4' },
    { id: '10', name: 'Mushroom Risotto', status: 'published', instructions: 'Sautee mushrooms, cook rice, add broth gradually.', user_id: '1' },
  ];
// Reviews:
    // Rating
    // User (reviewer)
    // Description
    // Recipe
let reviews = [
    { id: '1', rating: 5, description: 'Amazing recipe, really enjoyed it!', user_id: '1', recipe_id: '0' },
    { id: '2', rating: 4, description: 'Very good, but a little salty.', user_id: '0', recipe_id: '1' },
    { id: '3', rating: 3, description: 'It was okay. Needs more seasoning.', user_id: '2', recipe_id: '2' },
    { id: '4', rating: 5, description: 'The best beef stew I have ever had!', user_id: '3', recipe_id: '3'},
    { id: '5', rating: 4, description: 'Loved these tacos, though I added more salsa.', user_id: '4', recipe_id: '4' },
    { id: '6', rating: 5, description: 'Delicious chocolate cake! Perfect for birthdays.', user_id: '0', recipe_id: '5'},
    { id: '7', rating: 2, description: 'Pancakes turned out a little too flat.', user_id: '1', recipe_id: '6' },
    { id: '8', rating: 5, description: 'So hearty and flavorful. Perfect for cold days.', user_id: '2', recipe_id: '7' },
    { id: '9', rating: 3, description: 'Not a fan of the spice mix.', user_id: '3', recipe_id: '8' },
    { id: '10', rating: 4, description: 'Rich and creamy, but a bit too much butter.', user_id: '4', recipe_id: '9' },
    { id: '11', rating: 5, description: 'Great balance of flavors. Will make again.', user_id: '0', recipe_id: '1' },
    { id: '12', rating: 4, description: 'Simple yet tasty. I added a few extra veggies.', user_id: '1', recipe_id: '2'},
    { id: '13', rating: 5, description: 'Perfect recipe, everyone loved it.', user_id: '2', recipe_id: '5' },
    { id: '14', rating: 4, description: 'The soup was delicious, but a bit too spicy for me.', user_id: '3', recipe_id: '8' },
    { id: '15', rating: 5, description: 'A wonderful dish! Very comforting.', user_id: '4', recipe_id: '7' },
  ];

export default (users, recipes, reviews)