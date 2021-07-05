import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {default as multer} from 'multer'
import fs from 'fs'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi, { SwaggerOptions } from 'swagger-ui-express'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //@ts-ignore
    let uploadPath = path.join(`${process.env.UPLOAD_PATH}`, req.headers['path']);
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }

})
const upload = multer({storage: storage});

dotenv.config();

const app: express.Application = express();

// setting 필요
app.use(cors());

app.use(express.json());

app.use('/files', express.static('data'));

app.use('/update', express.static('updates'));

app.post('/upload', upload.array('test'), (req, res, next) => {
  console.log(req.body);
  console.log(req.files);
  console.log(req.file)
});

app.post('/upload', upload.array('teststring'), (req, res, next) => {
  // console.log(req);
  console.log(req.files);
  console.log(req.file)
});

console.log(`${process.env.SERVICE_PORT}`);
app.listen(`${process.env.SERVICE_PORT}`, () => {
  console.log(`Server On. Port: ${process.env.SERVICE_PORT}`);
})