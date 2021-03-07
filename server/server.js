const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const app = express();
mongoose.connect(process.env.DATABASE, {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log("DB CONNECTED"))
.catch((error) => console.log(`DB COnnection ERROR ${error}`))

app.use(morgan("dev"));
app.use(bodyParser.json({limit: "2mb"}));
app.use(cors());

fs.readdirSync('./routes').map((route) => 
    app.use("/api", require("./routes/"+route))
);
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`SERVER IS RUNNING ON port ${port}`));

