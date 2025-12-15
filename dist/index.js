import express from "express";
const app = express();
app.post('/v1/signup', (req, res) => {
    res.send("hi");
});