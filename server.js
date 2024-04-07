import express from 'express';
import recipes from './recipes.js'
import connection from './connection.js'
import path from 'path'


//connect to mongoDB
connection();

//setup
const port = process.env.PORT || 5000;
const app = express();

//middlewear
app.use(express.static('static'));
app.use(express.json());

app.get('/', (req,res) =>  {
    res.sendFile(path.join(process.cwd() + '/index.html'))
})

app.post('/recipes', async (req, res) => {
    const { title, ingredients, instructions, cookingTime } = req.body

    if (!title || !ingredients || !instructions || !cookingTime) 
        res.status(404).json({message: 'Please enter title, ingredients, instructions, cooking time.'});
    

    const newRecipe = new recipes({
        title: title,
        ingredients: ingredients,
        instructions: instructions,
        cookingTime: cookingTime
    });

    try {
        const recipe = await newRecipe.save()
        res.status(201).json(recipe)
    } catch (err) {
        res.status(500).json({message: 'Internal server error', err})
    }
})

app.get('/recipes/:title', async (req, res) => {
    try {
        const findTitle = await recipes.find({ title: req.params.title })
        if ( findTitle.length > 0) {
            res.status(201).json(findTitle)
        } else {
            res.status(404).json({ message: 'Recipe not found!'})
        } 
    } catch (err) {
        res.status(500).json({ message: 'Internal server error'}, err)
    }
})


app.listen(port, () => {
    console.log(`Listening @ Localhost:${ port }`)
});
