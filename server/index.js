"use strict";

const express = require("express");
const morgan = require("morgan");

const os_manager = require("./os_manager");

const app = express();
app.use(morgan("dev"));
app.use(express.json());


app.get("api/stats", (req, res) => {
    const stats = os_manager.getStats();
    res.json(stats);
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
    os_manager.getStats();
});