const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();

const PORT = 9000;

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome to the user API!");
});

app.get("/users", (req, res) => {
  const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>
    `;
  res.send(html);
});
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], ...req.body };

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update user" });
      }
      return res.json({ status: "Success", user: users[userIndex] });
    });
  })

  .delete((req, res) => {
    const body = req.body;
    users.pop({ ...body, id: users.length - 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Success", id: users.length });
    });
  })
  .post((req, res) => {
    const body = req.body;
    users.push({ ...body, id: users.length });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Success", id: users.length });
    });
  });

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  });
});

app.delete("/api/users", (req, res) => {
  const body = req.body;
  users.pop({ ...body, id: users.length - 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  });
});

app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update user" });
    }
    res.json({ status: "Success", user: users[userIndex] });
  });
});

app.listen(PORT, () => {
  console.log(`Server is started at PORT: ${PORT}`);
});
