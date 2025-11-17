const mongoose = require("mongoose");
const { Schema } = mongoose;

const departamentosSchema = new Schema(
    {
        name: { type: Schema.Types.String },
        description: { type: Schema.Types.String },
        activo: { type: Schema.Types.Boolean, default: true },
        userAdd: { type: Schema.Types.Mixed },
        userUpd: { type: Schema.Types.Mixed },
        userDel: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

module.exports = mongoose.model("departamentos", departamentosSchema);