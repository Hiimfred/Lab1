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
app.use(express.urlencoded({extended: true}))
app.use(express.static('static'));
app.use(express.json());

//startpage
app.get('/', (req,res) =>  {
    res.sendFile(path.join(process.cwd() + '/index.html'))
})

//hämta alla recept
app.get('/recipes', async (req, res) => {
    try {
        const recipe = await recipes.find()
        res.status(200).json(recipe)
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// hämta recepted med <title>
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

//Skapa nytt recept
app.post('/recipes', async (req, res) => {
    const { title, ingredients, instructions, cookingTime } = req.body

    if (!title || !ingredients || !instructions || !cookingTime) 
        res.status(400).json({message: 'Please enter title, ingredients, instructions, cooking time.'});
    

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

//uppdatera ett recept med <title>
app.put('/recipes/:title', async (req, res) => {
    const { ingredients, instructions, cookingTime } = req.body
    const { title } = req.params;

    try {
        const recipe = await recipes.findOneAndUpdate(
            { title: title },
            { ingredients, instructions, cookingTime },
            { new: true }
        );

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        } else {
            res.status(202).json({ message: 'Recipe updated!', recipe })
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error'})
    }
})

//delete ett recept med <title>
app.delete('/recipes/:title', async (req, res) => {
    const title = req.params.title

    try {
        const recipe = await recipes.findOneAndDelete( { title: req.params.title })

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found'})
        } else {
            res.status(202).json({ message: 'Recipe removed', recipe })
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error'})
    }
})


app.listen(port, () => {
    console.log(`Listening @ Localhost:${ port }`)
});
