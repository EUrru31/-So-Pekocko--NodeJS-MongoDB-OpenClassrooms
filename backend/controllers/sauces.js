// Importation modèle de sauce
const Sauce = require("../models/sauces");
const fs = require("fs");

// Controle des routes de l'application

// Création de sauce
exports.createSauce = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...saucesObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};

//Récupérer une Sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((thing) => {
            res.status(200).json(thing);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObjet = req.file
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObjet, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res.status(200).json({ message: "Objet supprimé !" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

// Récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

// Like Dislike des sauces
exports.likeDislike = async (req, res, next) => {
    const like = req.body.like;
    const sauceId = req.params.id;
    const userId = req.body.userId;
    const sauce = await Sauce.findOne({
        _id: req.params.id,
    });
    console.log(req.body);
    if (like === 1) {
        await likeSauce(sauce, userId);
    }
    if (like === 0) {
        await removeLikeDislike(sauce, userId);
    }
    if (like === -1) {
        await dislikeSauce(sauce, userId);
    }
    res.status(200).json({});
};

async function dislikeSauce(sauce, userId) {
    if (sauce.usersDisliked.includes(userId)) return;
    const updateOperation = {
        $push: { usersDisliked: userId },
        $inc: { dislikes: 1 },
    };
    if (sauce.usersLiked.includes(userId)) {
        updateOperation["$pull"] = { usersLiked: userId };
        updateOperation["$inc"].likes = -1;
    }
    await Sauce.updateOne({ _id: sauce._id }, updateOperation);
}

async function removeLikeDislike(sauce, userId) {
    const updateOperation = {};
    if (sauce.usersLiked.includes(userId)) {
        updateOperation["$pull"] = { usersLiked: userId };
        updateOperation["$inc"] = { likes: -1 };
    }
    if (sauce.usersDisliked.includes(userId)) {
        updateOperation["$pull"] = { usersDisliked: userId };
        updateOperation["$inc"] = { dislikes: -1 };
    }
    await Sauce.updateOne({ _id: sauce._id }, updateOperation);
}

async function likeSauce(sauce, userId) {
    if (sauce.usersLiked.includes(userId)) return;
    const updateOperation = {
        $push: { usersLiked: userId },
        $inc: { likes: 1 },
    };
    if (sauce.usersDisliked.includes(userId)) {
        updateOperation["$pull"] = { usersDisliked: userId };
        updateOperation["$inc"].dislikes = -1;
    }
    await Sauce.updateOne({ _id: sauce._id }, updateOperation);
}
