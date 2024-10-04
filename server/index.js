"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
import { SERVER_URL } from "../constants";
const corsOptions = {origin: ["http://localhost:5173", "http://127.0.0.1:5173", `${SERVER_URL}:5173`]};

const os_manager = require("./os_manager");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));

app.get("/api/stats", (req, res) => {
    // console.log("Richiesta di statistiche ricevuta");
    const stats = os_manager.getStats()
    .then( (data) => {
        console.log(data);
        res.json(data);
    }).catch( (err) => {
        console.log(err);
        res.json(err);
    });
});

app.get("/api/processes", (req, res) => {
    // console.log("Richiesta di processi ricevuta");
    const processes = os_manager.getProcesses()
    .then( (data) => {
        console.log(data);
        res.json({"array": data});
    }).catch( (err) => {
        console.log(err);
        res.json(err);
    });
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
    os_manager.getStats();
    os_manager.getProcesses();
});