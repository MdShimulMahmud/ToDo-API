const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routeHandler/todoHandler");

const app = express();
app.use(express.json());
const PORT = 3000;

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Successful!"))
  .catch((err) => console.log(err));
//routes
app.use("/todo", todoHandler);

function errorHandeler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
