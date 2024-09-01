const { Task } = require("../models/Task");
const WebSocket = require("ws");
const zlib = require("zlib");
const path = require("path");
const File = require("../models/File");

exports.createTask = async (req, res) => {
  const task = new Task({
    ...req.body, // ? spread syntax (important)
    owner: req.user.id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send("Error creating task: " + error.message);
  }
};

// ? Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving tasks" });
  }
};

// ? Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params; // ! id of the task
    const updates = req.body;

    // ? Ensure the user owns the task they want to update
    const task = await Task.findOne({ _id: id, owner: req.user.id });

    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    Object.assign(task, updates); // ! take a copy of updates, then  move it to task (overwite)

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
};

// ? Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // ? Ensure the user owns the task they want to delete
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user.id });

    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.status(204).send(); // ? Successfully deleted
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};

exports.getTask = async (req, res) => {
  const { taskId } = req.params; // ! so i can now get the task they invited to me

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    // ? Check if the user is the owner or an invited user
    if (
      task.owner.toString() !== req.user.id &&
      !task.invitedUsers.includes(req.user.email)
    ) {
      return res.status(403).send("You do not have access to this task");
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).send("Error retrieving task details");
  }
};

exports.addComment = async (req, res) => {
  const { taskId } = req.params;
  const { text } = req.body;
  const wss = req.wss; // ? Access wss from req

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    // ? Check if the user is the owner or an invited user
    if (
      task.owner.toString() !== req.user.id &&
      !task.invitedUsers.includes(req.user.email)
    ) {
      return res
        .status(403)
        .send("You do not have access to comment on this task");
    }

    // Add the comment
    const comment = {
      text,
      author: req.user.id,
    };
    task.comments.push(comment);
    await task.save();

    // Prepare the notification data
    const notification = {
      taskId: task.id,
      comment: {
        text: comment.text,
        author: req.user.name,
      },
    };

    // ? Broadcast the new comment to all WebSocket clients who have access to this task
    wss.clients.forEach((client) => {
      try {
        if (
          client.readyState === WebSocket.OPEN &&
          client.user &&
          (client.user.id === task.owner.toString() ||
            task.invitedUsers.includes(client.user.email))
        ) {
          client.send(JSON.stringify(notification));
        }
      } catch (wsError) {
        console.error("Error broadcasting message to client:", wsError);
      }
    });

    res.status(200).send("Comment added successfully");
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send("Error adding comment: " + error.message);
  }
};

// ! add images to the tasks
exports.uploadTaskImage = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("No files uploaded.");
  }

  let files = req.files.file;
  if (!Array.isArray(files)) {
    files = [files];
  }

  const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".pdf"];

  try {
    // ? Extract taskId from the request body
    const taskId = req.body.taskId;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).send("Task not found.");
    }

    // ? Only the task owner can add images to his task
    if (task.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .send("You are not allowed to add images to this task");
    }

    const fileIds = await Promise.all(
      files.map(async (file) => {
        const filename = file.name;
        const fileExtension = path.extname(filename).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error(
            `Invalid file type for ${filename}. Only images and PDFs are allowed.`
          );
        }

        if (file.size > 1 * 1024 * 1024) {
          throw new Error(`File size for ${filename} exceeds 1MB.`);
        }

        const compressedBuffer = await new Promise((resolve, reject) => {
          zlib.gzip(file.data, (err, buffer) => {
            if (err) return reject("Error occurred while compressing the file");
            resolve(buffer);
          });
        });

        const newFile = new File({
          filename: filename,
          size: file.size,
          content: compressedBuffer,
          contentType: file.mimetype,
        });

        await newFile.save();

        return newFile._id;
      })
    );

    // ! Link the file IDs to the task
    task.images.push(...fileIds);
    await task.save();

    res.send("Images uploaded and linked to task successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getTaskImage = async (req, res) => {
  const { taskId, fileId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send("Task not found.");
    }

    if (task.owner.toString() !== req.user.id) {
      return res.status(403).send("You are not allowed to access this file");
    }

    if (!task.images.includes(fileId)) {
      return res
        .status(404)
        .send("File not found or not associated with this task");
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).send("File not found.");
    }

    zlib.gunzip(file.content, (err, decompressedBuffer) => {
      if (err) {
        return res
          .status(500)
          .send("Error occurred while decompressing the file.");
      }

      const ext = path.extname(file.filename).toLowerCase();

      // Define a function to get the MIME type
      const getMimeType = (extension) => {
        switch (extension) {
          case ".png":
            return "image/png";
          case ".jpg":
          case ".jpeg":
            return "image/jpeg";
          case ".gif":
            return "image/gif";
          case ".pdf":
            return "application/pdf";
          default:
            return "application/octet-stream";
        }
      };

      const contentType = getMimeType(ext);

      // Set headers for the response
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${file.filename}`
      );
      res.setHeader("Content-Type", contentType);

      // Send the decompressed file content
      res.send(decompressedBuffer);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
