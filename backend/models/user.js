const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validate = require("mongoose-validator");

// Modele du mail
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            validate({
                validator: "isEmail",
                message: "Veuillez entrer un email valide",
            }),
        ],
    },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
