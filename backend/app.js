const express = require("express");
const Thing = require("./models/thing");
const app = express();

mongoose
    .connect(
        "mongodb+srv://nafsi_31:E44fi88e@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.post("/api/sauces", (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
        ...req.body,
    });
    thing
        .save()
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
});

app.use("/api/sauces", (req, res, next) => {
    res.status(200).json(stuff);
});

module.exports = app;
