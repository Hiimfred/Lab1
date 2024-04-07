import mongoose from 'mongoose';

const recipesSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true},
        ingredients: { type: Array, required: true },
        instructions: { type: String, required: true },
        cookingTime: { type: Number, required: true }
    }
)

export default mongoose.model("recipes", recipesSchema)