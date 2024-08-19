const joi = require("joi"); // ?used for validation (simple validation)

const courses = [
  { id: 1, name: "Course1" },
  { id: 2, name: "Course2" },
  { id: 3, name: "Course3" },
];

function validateCourse(course) {
  const schema = {
    name: joi.string().min(3).required(),
  };

  return joi.validate(course, schema);
}

// ?Get all courses
exports.getAllCourses = (req, res) => {
  res.send(courses);
};

// ?Get course by ID
exports.getCourseById = (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("The course does not exist");
  res.send(course);
};

// ?Create new course
exports.createCourse = (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
};

// ?Update existing course
exports.updateCourse = (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("The course does not exist");

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
};

// !Delete a course
exports.deleteCourse = (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("The course does not exist");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
};
