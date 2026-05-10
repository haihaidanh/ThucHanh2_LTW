const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const LoginRouter = require("./routes/AuthRouter");
const CommentRouter = require("./routes/CommentRouter");
const { authMiddleware } = require("./middleware/auth");
const path = require("path");

dbConnect();

app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use("/", LoginRouter);
app.use("/api/user", UserRouter);
app.use("/api/photo", authMiddleware, PhotoRouter);
app.use("/", authMiddleware, CommentRouter);


app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
