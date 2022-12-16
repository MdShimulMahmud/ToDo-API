const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo").find({ status: "inactive" });
  },
  findActiveCallback: function (cb) {
    return mongoose.model("Todo").find({ status: "active" }, cb);
  },
};

todoSchema.statics = {
  findByJS: function () {
    return this.find({ title: /sh/i });
  },
};

todoSchema.query = {
  findByLanguage: function (language) {
    return this.find({ status: new RegExp(language, "i") });
  },
};

module.exports = todoSchema;
