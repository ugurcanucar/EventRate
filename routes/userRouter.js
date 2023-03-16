import { Router } from "express";

import postgresClient from "../config/db.js";

const router = Router();

router.post("/addUser", async (req, res) => {
  try {
    const query =
      "INSERT INTO users (email,password) VALUES ($1,crypt($2, gen_salt('bf'))) RETURNING *";

    // "INSERT INTO users (email,password,fullName) VALUES ($1,crypt($2, gen_salt('bf')), $3) RETURNING *";

    const values = [req.body.email, req.body.password];

    const { rows } = await postgresClient.query(query, values);

    return res.status(201).json({ createdUser: rows[0] });
  } catch (error) {
    console.log("Has error ", error);
    return res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const query = "SELECT*FROM users";
    const { rows } = await postgresClient.query(query);
    console.log(rows);
    return res.status(200).json({
      users: rows,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const query = "SELECT*FROM users where id= $1";
    const { rows } = await postgresClient.query(query, [req.params.userId]);
    return res.status(200).json({
      users: rows[0],
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

router.put("/updateUser/:id", async (req, res) => {
  try {
    const { email, fullName } = req.body;
    const query =
      "UPDATE users SET email = $1, fullName = $2 WHERE id = $3 RETURNING *";
    console.log(req.params);
    const values = [email, fullName, parseInt(req.params.id)];
    const { rows } = await postgresClient.query(query, values);
    if (!rows.length) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({
      user: rows[0],
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const query = "DELETE from users where id = $1 Returning *";
    const { rows } = await postgresClient.query(query, [req.params.userId]);
    if (!rows.length) return res.json({ message: "User Not Found" });
    return res.json({
      message: "User Deleted",
      user: rows[0],
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

export default router;
