const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./db");

dotenv.config();
const app = express();

// middleware
app.use(express.json()); //req.body
app.use(cors());

// ROUTES

// create a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// get all todos
app.get("/todos", async (req, res) => {
    try {
        const newTodo = await pool.query("SELECT * FROM todo");

        res.json(newTodo.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const newTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const newTodo = await pool.query("UPDATE todo set description = $1 WHERE todo_id = $2", [description, id]);

        res.json("Todo was updated");
    } catch (err) {
        console.error(err.message);
    }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const newTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);

        res.json("Todo was deleted");
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server running @ PORT " + process.env.PORT);
});
