# Task Management Application

This project is a comprehensive Task Management Application built with Node.js, Express, MongoDB, and Mongoose. It includes features for user authentication, task creation, and management, along with an image upload system where users can attach images to their tasks. The application also integrates with WebSockets for real-time communication, such as notifications and comments.

# Features
* User Authentication: Secure user registration and login with password hashing using bcrypt and JWT-based authentication.
* Task Management: Users can create, read, update, and delete tasks. Tasks include fields such as title, description, status, due date, and more.
* Image Uploads: Users can upload images and PDFs as attachments to their tasks. The uploaded files are validated for size and type, compressed for storage, and linked to the corresponding task.
* Real-Time Communication: WebSocket integration allows for real-time notifications, such as new comments on tasks.
* Invitation System: Users can invite others via email to view or comment on tasks.
* Task Cleanup: Automated task cleanup feature that runs daily, deleting old or completed tasks.
* File Retrieval: Attached files can be retrieved and displayed when viewing tasks.
