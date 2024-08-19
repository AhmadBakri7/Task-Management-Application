const joi = require("joi"); // used for validation (simple validation)
const express = require("express");
const app = express();

app.use(express.json()); // for parsing application/json, to enable to access this for example (name: req.body.name)

const courses = [
  { id: 1, name: "Course1" },
  { id: 2, name: "Course2" },
  { id: 3, name: "Course3" },
];

app.get("/", (req, res) => {
  res.send("hello world!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id)); // c is a course

  if (!course) {
    res.status(404).send("The course does not exist");
    return; // This ensures that the function exits after sending the 404 response
  }

  res.send(course); // This sends the course if found
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(404).send(result.error.details[0].message);
    return;
  }

  // if (!req.body.name || req.body.name.length < 3) {
  //   // 400 Bad Request
  //   res
  //     .status(400)
  //     .send("name is required and must be at least 3 characters long");
  // }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  // look at the couese
  // if not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id)); // c is a course

  if (!course) {
    res.status(404).send("The course does not exist");
    return;
  }

  // Validate
  //if invalid, return - 400 Bad Request
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(404).send(result.error.details[0].message);
    return;
  }

  // update course
  course.name = req.body.name;
  // return the updated course
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  // look at the couese
  // if not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id)); // c is a course

  if (!course) {
    res.status(404).send("The course does not exist");
    return;
  }

  // Delete the course
  const index = courses.indexOf(course);
  courses.splice(index, 1); // splice for delete, and 1 means one object

  // return the course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: joi.string().min(3).required(),
  };

  return joi.validate(course, schema);
}

// const port process.env.PORT || 3000 (TO CHANGE THE PORT)
app.listen(3000, () => console.log("Listening on port 3000"));
