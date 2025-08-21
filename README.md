1.creating database file --> sqlite3 recipes.db

2.Importing recipes.json into the database

3.Install dependencies
npm init -y
npm install express sqlite3 body-parser cors

4.Run server
node index.js
API runs on: http://localhost:3000

5.API Testing Instructions
Get Recipes (with pagination, search, sort)
GET http://localhost:3000/recipes?page=1&limit=5&sort=prep_time&search=chicken

Get Recipe by ID
GET http://localhost:3000/recipes/1

Add a Recipe
POST http://localhost:3000/recipes
Content-Type: application/json
