const express = require("express")
const app = express()
const userRouter = require('./routes/user.routes')
const dotenv = require('dotenv');
dotenv.config();
const connectToDB = require('./config/db')
connectToDB()
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const indexRouter = require('./routes/index.routes')


dotenv.config()

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/user', userRouter)
app.use('/', indexRouter)


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});