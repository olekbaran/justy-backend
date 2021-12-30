const router = require("express").Router();
const User = require("../classes/User");
const Todo = require("../classes/Todo");

router.use(async (req, res, next) => {
  if (!req.user) {
    res.status(403);
    res.send({ message: "Unauthorized" });
    return;
  }
  req.db_user = await User.findOne({ _id: req.user.id });
  if (!req.db_user) {
    res.status(403);
    res.send({ message: "Unauthorized" });
    return;
  }
  next();
});

// Create
router.post("/", async (req, res) => {
  let { title, description, endDate, category } = req.body;
  if (!title || !endDate) {
    res.status(400);
    res.send({ message: "Title and endDate are required" });
    return;
  }
  let array = req.db_user.todos;
  const newTodo = new Todo(title, description, { endDate, category });
  array.push(newTodo);

  await req.db_user.updateOne({ todos: array });

  res.status(200);
  res.send({ message: "OK", id: newTodo.id });
});

router.post("/edit", async (req, res) => {
  let { title, description, endDate, category, item_id, done } = req.body;

  if (!item_id || (done && typeof done != 'boolean') || (endDate && typeof endDate != 'number')) {
    res.status(400);
    res.send({ message: "item_id is required or data types are invalid" });
    return;
  }
  let array = req.db_user.todos;

  for (item in array) {
    if (array[item].id === item_id) {
      let previous = array[item];
      if (!title) title = previous.title;
      if (!description) description = previous.description;
      if (!endDate) endDate = previous.endDate;
      if (!category) category = previous.category;
      if (!done) done = previous.done;
      array.splice(
        item,
        1,
        new Todo(title, description, { endDate, category, item_id, done })
      );

      await req.db_user.updateOne({ todos: array });
      break;
    }
  }
  res.status(200);
  res.send({ message: "OK" });
});

router.delete("/", async (req, res) => {
  let id = req.body.item_id;
  if (!id) {
    res.status(400);
    res.send({ message: "item_id is required" });
    return;
  }

  let array = req.db_user.todos;
  if (array.length > 0) {
    for (item in array) {
      if (array[item].id === id) {
        array.splice(item, 1);
        await req.db_user.updateOne({ todos: array });
        break;
      }
    }
  }

  res.status(200);
  res.send({ message: "OK", status: 200 });
});

router.get("/", async (req, res) => {
  res.status(200);
  res.send({ message: "OK", list: JSON.stringify(req.db_user.todos) });
});

module.exports = router;
