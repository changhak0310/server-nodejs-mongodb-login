require('dotenv').config();

var express = require('express');
var app = express();

const routers = require('./routers');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { JwtMiddleware } = require('./middleware/mid_token');

mongoose.Promise = global.Promise;

// [ CONFIGURE mongoose ]
// CONNECT TO MONGODB SERVER
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Successfully connected to mongodb');
})
.catch((err) => {
    console.error(err);
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(JwtMiddleware);


// Cross-Origin Resource Sharing(CORS) 오류 해결을 위해 사용
const cors = require('cors');
app.use(cors());

app.use('/api', routers);

const port = 8000;
app.listen(port, () => console.log(`Node.js Server is running on port ${port}...`));

module.exports = app;
