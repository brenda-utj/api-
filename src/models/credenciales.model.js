const mongoose = require("mongoose");
const { Schema } = mongoose; 

const credencialesSchema = new Schema(
    {
        name: String,
        description: String,
        module: Object,
        submodule: Object,
        userAdd: Object,
        userUpd: Object,
        userDel: Object,
        active: Boolean,
    }
);

module.exports = mongoose.model("credenciales", credencialesSchema);