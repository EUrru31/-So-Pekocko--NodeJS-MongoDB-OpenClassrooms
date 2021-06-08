const express = require("express");

const app = express();

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

app.use("/api/sauces", (req, res, next) => {
    const stuff = [
        {
            _id: "oeihfzeoi",
            userId: "62982",
            name: "sauce piquante",
            manufacturer: "idaizd",
            description: "dnudnakdbqydvbjqkd hduqhdkqdhquk duqhdukqhd",
            mainPepper: "piment",
            imageUrl: "#",
            heat: "6",
            likes: "#",
            dislikes: "#",
            usersLiked: "#",
            usersDisliked: "#",
        },
        {
            _id: "oeihfzeoi",
            userId: "19613",
            name: "sauce piquante2",
            manufacturer: "hfttcbdgdr",
            description: "dnudnakdbqydvbjqkd hduqhdkqdhquk duqhdukqhd",
            mainPepper: "poivron",
            imageUrl: "#",
            heat: "8",
            likes: "#",
            dislikes: "#",
            usersLiked: "#",
            usersDisliked: "#",
        },
    ];
    res.status(200).json(stuff);
});

module.exports = app;
