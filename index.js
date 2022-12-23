import express from 'express';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import rout from './routes/index.js';
const  cors   = require( 'cors');
import path from 'path'; // thu vien path de chuyen duong dan thu muc
const dotenv = require('dotenv');
import { fileURLToPath } from 'url';
//const morgan=require("morgan");
//const handlebars= require("express-handlebars");
const app = express();
const port = 3000;
const __filename=fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename);

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {  
    console.log('DB connection successful');
  });

app.use(express.urlencoded({
    extended: true
}))

app.use(cookieParser())
app.use(cors());

// khai bao engine voi ten hbs
app.engine('hbs', engine({
    // defaultLayout: 'main.hbs'
    extname: 'hbs',
    defaultLayout: 'main'
}));

app.use(express.static("public/img"));
app.set('view engine', 'hbs');
app.set('views', './views');
//app.set('views', path.join(__dirname,'views/layouts/Teacher'));

//console.log('Path:',path.join(__dirname,'views/Teacher'));
app.use(rout); // router root 

app.listen(port, () => {
    console.log( `Example app listening at http://localhost:${port}`)
})
// Run :npm start