import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {default as multer} from 'multer'
import fs from 'fs'
import path from 'path'
import { File } from './types'
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

app.use('/files', express.static('uploads'));

app.use('/update', express.static('updates'));

app.post('/upload', upload.array('eztalk-upload'), (req, res, next) => {
  const now = new Date();

  if (req.files) {
    let reqFiles = req.files as Express.Multer.File[];
    let responseFiles = [] as File[];
    for (let i = 0; i < reqFiles.length; i++) {
      responseFiles.push({
        remote_url: reqFiles[i].path.replace('uploads', 'files'),
        file_name: reqFiles[i].originalname,
        file_size: reqFiles[i].size,
        file_extension: reqFiles[i].mimetype,
        expire_date: now
      } as File)
    }
    res.send(responseFiles);
  }
  next({})
});

console.log(`${process.env.SERVICE_PORT}`);
app.listen(`${process.env.SERVICE_PORT}`, () => {
  console.log(`Server On. Port: ${process.env.SERVICE_PORT}`);
})