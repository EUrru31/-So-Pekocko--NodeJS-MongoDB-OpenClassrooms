const Sauce = require("../models/sauces");
const fs = require("fs");

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

exports.modifySauce = (req, res, next) => {
    const sauceObjet = req.file
        ? {
              ...JSON.parse(req.body.thing),
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

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((thing) => {
            const filename = thing.imageUrl.split("/images/")[1];
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

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((things) => {
            res.status(200).json(things);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};
