const mongoose = require("mongoose");
const { Schema } = mongoose;

const modulosSchema = new Schema(
    {
        name: { type: String, required: true, unique: true, lowercase: true, trim: true },
        icon: String,
        displayName: String,
        active: Boolean,
        view: Boolean, //disponible para ver
        file: String,
        position: Number,
        credential: String,
        submodules: [],
        userAdd: { },
        userUpd: { },
        userDel: { }
    }
);

module.exports = mongoose.model("modulos", modulosSchema);