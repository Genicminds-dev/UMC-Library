const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");

router.post("/users", async (req, res) => {
  const { name, email, role, status, username, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const query =
    "INSERT INTO users (name, email, role, status, username, password) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [name, email, role, status, username, hashedPassword],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res
        .status(201)
        .json({
          id: results.insertId,
          name,
          email,
          role,
          status,
          username,
        });
    }
  );
});

router.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status, username, password } = req.body;
  // const hashedPassword = await bcrypt.hash(password, 10);
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const query =
    "UPDATE users SET name = ?, email = ?, role = ?, status = ?, username = ?, password = ? WHERE id = ?";
  db.query(
    query,
    [name, email, role, status, username, hashedPassword, id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({ id, name, email, role, status, username });
    }
  );
});

router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

module.exports = router;
