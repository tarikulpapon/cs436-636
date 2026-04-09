import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  "https://podgtscfaaqqyvkhhnyg.supabase.co", // ← replace
  "sb_publishable_x9gn5jfmj68FJq2L6usikA_jH6MAr--"                         // ← replace
);

// GET all students
app.get("/api/students", async (req, res) => {
  const { sort = "name", order = "asc" } = req.query;
  const validSorts = ["name", "class_of"];
  const sortCol = validSorts.includes(sort) ? sort : "name";

  const { data, error } = await supabase
    .from("umb_students")
    .select("*")
    .order(sortCol, { ascending: order !== "desc" });

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// GET single student
app.get("/api/students/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("umb_students")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

// POST create student
app.post("/api/students", async (req, res) => {
  const { id, name, email, address, dob, gender, class_of } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email are required." });

  const { data, error } = await supabase
    .from("umb_students")
    .insert([{ id, name, email, address, dob, gender, class_of }])
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// PUT update student
app.put("/api/students/:id", async (req, res) => {
  const { id, name, email, address, dob, gender, class_of } = req.body;

  const { data, error } = await supabase
    .from("umb_students")
    .update({ name, email, address, dob, gender, class_of })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// DELETE student
app.delete("/api/students/:id", async (req, res) => {
  const { error } = await supabase
    .from("umb_students")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json({ success: true });
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
