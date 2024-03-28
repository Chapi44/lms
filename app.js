require("express-async-errors");

const cors = require("cors");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const connectDB = require("./db/connect.js");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userroutes.js");
const courseRoutes = require("./routes/courseRoutes.js")
const InstructorRoutes = require('./routes/InstructorRouter.js')

const corsOptions = require("./config/corsOptions.js")

// Middleware
const notFoundMiddleware = require("./middelware/not-found.js");
const errorHandlerMiddleware = require("./middelware/error-handler.js");


app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use('/api/v1/course',courseRoutes)
app.use('/api/v1/Instruct',InstructorRoutes);



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
