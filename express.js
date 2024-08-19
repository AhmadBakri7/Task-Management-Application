const express = require("express");
const app = express();
const coursesController = require("./controllers/coursesController");

app.use(express.json()); // for parsing application/json, to enable to access this for example (name: req.body.name)

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api/courses", coursesController.getAllCourses);
app.get("/api/courses/:id", coursesController.getCourseById);
app.post("/api/courses", coursesController.createCourse);
app.put("/api/courses/:id", coursesController.updateCourse);
app.delete("/api/courses/:id", coursesController.deleteCourse);

app.listen(3000, () => console.log("Listening on port 3000"));
