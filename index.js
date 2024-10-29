

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const FoodModel = require("./models/Food");

//mongoose.connect("mongodb://127.0.0.1:27017/food", { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect("mongodb+srv://admin:admin@cluster0.q4fm4.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.post("/insert", async (req, res) => {
    const { foodName, description } = req.body;

    const food = new FoodModel({ foodName, description });
    try {
        await food.save();
        res.status(201).send("Food item created");
    } catch (err) {
        console.error(err);
        res.status(400).send("Error creating food item");
    }
});

app.get("/read", async (req, res) => {
    try {
        const result = await FoodModel.find({});
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving food items");
    }
});

app.put("/update", async (req, res) => {
    const { newFoodName, id } = req.body;

    try {
        const updatedFood = await FoodModel.findById(id);
        if (!updatedFood) {
            return res.status(404).send("Food item not found");
        }
        updatedFood.foodName = newFoodName;
        await updatedFood.save();
        res.send("Food item updated");
    } catch (err) {
        console.error(err);
        res.status(400).send("Error updating food item");
    }
});

app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await FoodModel.findByIdAndRemove(id);
        if (!result) {
            return res.status(404).send("Food item not found");
        }
        res.send("Food item deleted");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting food item");
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
