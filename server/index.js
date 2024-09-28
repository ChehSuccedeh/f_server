"use strict";

const express = require("express");
const morgan = require("morgan");

const os_manager = require("./os_manager");

const app = express();
app.use(morgan("dev"));
app.use(express.json());


app.get("api/stats", (req, res) => {

});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
    for (let i = 0; i < 10; i++){
        // os_manager.getStats();
        setInterval(() => {
            os_manager.getStats();
        }, 10000);
    }
});