const express = require("express");
const todoSchema = require("../models/todoSchema");
const mongoose = require("mongoose");
const checkLogin = require("../middlewares/checkLogin");
const router = express.Router();

const Todo = mongoose.model("Todo", todoSchema);
router.use(express.json());

// instances methods
router.get("/", checkLogin, (req, res) => {
  Todo.find({})
    .populate("user", "name username -_id")
    .select({
      _id: 0,
      __v: 0,
      date: 0,
    })
    .limit(2)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({
          result: data,
          message: "Success",
        });
      }
    });
});
router.get("/active", async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
    data,
  });
});

router.get("/active-callback", async (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    if (err) {
      res.status(500).json({
        message: "There was an error!",
      });
    } else {
      res.status(200).json({
        data,
      });
    }
  });
});

// static methods

router.get("/sh", async (req, res) => {
  const data = await Todo.findByJS();
  res.status(200).json({
    data,
  });
});

// query helpers

router.get("/language", async (req, res) => {
  const data = await Todo.find().findByLanguage("active");
  res.status(200).json({
    data,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const data = await Todo.findOne({ _id: req.params.id });
    res.status(200).json({
      result: data,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

router.put("/:id", (req, res) => {
  const data = Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        status: "inactive",
      },
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({
          message: "Todo was updated successfully!",
        });
      }
    }
  );
  console.log(data);
});

router.post("/", async (req, res) => {
  // console.log(req.body);
  const newTodo = new Todo(req.body);

  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({ error: "There was a server side error!" });
    } else {
      res.status(200).json({ message: "Todo was successfully added!" });
    }
  });
});

router.post("/all", (req, res) => {
  console.log(req.body);
  Todo.insertMany(req.body, (err) => {
    if (err) {
      //   console.log(newTodo);
      res.status(500).json({ error: "There was a server side error!" });
    } else {
      res.status(200).json({ message: "Todo was successfully added!" });
    }
  });
});

router.delete("/:id", (req, res) => {
  Todo.findOneAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        message: "Todo was deleted successfully!",
      });
    }
  });
});

module.exports = router;
