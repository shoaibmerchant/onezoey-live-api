import express from "express";
import multer from "multer";
import path from "path";
import { get } from "lodash";
import { createApolloFetch } from 'apollo-fetch';

const { AWS_S3BUCKET_NAME, AWS_S3BUCKET_REGION, GRAPHQL_ENDPOINT } = process.env;

const UPLOAD_DIR = "./tmp/";

const uploadToS3Mutation = `
mutation uploadToS3($src: String!, $dest: String!) {
  econsultations {
    awsS3 {
      upload(src: $src, dest: $dest)
    }
  }
}`;

const uploadToS3 = (filename) => {
  const dest = `oz-live/econsult/${Date.now()}/${filename}`;
  const apolloFetch = createApolloFetch({ uri: GRAPHQL_ENDPOINT });
  const variables = {
    src: filename,
    dest,
  };

  return new Promise((resolve, reject) => {
    apolloFetch({
      query: uploadToS3Mutation,
      variables,
    })
      .then((result) => {
        const response = get(result, 'data.econsultations.awsS3.upload');
        if (response) {
          const filepath = `https://s3-${AWS_S3BUCKET_REGION}.amazonaws.com/${AWS_S3BUCKET_NAME}/${dest}`;
          resolve(filepath);
        } else {
          reject("ERROR_UPLOADING_TO_S3");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

class Uploader {
  constructor() {
    this.storage = multer.diskStorage({
      destination: UPLOAD_DIR,
      filename: function (req, file, cb) {
        cb(
          null,
          file.originalname,
        );
      }
    });
  }

  uploader(field) {
    console.log("innn", field);
    return multer({
      storage: this.storage,
      fileFilter: (req, file, cb) => {
        console.log("i file filter", file);
        this.checkFileType(file, cb);
      }
    }).single(field);
  }

  checkFileType(file, cb) {
    console.log("file.orginalName", file.originalname, file.mimetype);
    // Allowed ext
    const filetypes = /image\/jpg|image\/jpeg|jpeg|jpg|png|pdf|docx|mp4/;
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("File type not allowed");
    }
  }

  handler() {
    const app = express.Router();

    app.post("/:field", (req, res) => {
      console.log("Enter Upload", req.file, req.uri);
      const upload = this.uploader(req.params.field || "file");

      upload(req, res, err => {
        console.log("in upload function", req.file);
        if (err) {
          console.log("first err", err);
          res.send({
            code: "ERROR_IN_UPLOAD",
            msg: "Error uploading file"
          });
        } else {
          if (req.file == undefined) {
            console.log("Error: No File Selected!");
            res.send({
              code: "NO_FILE",
              msg: "No file selected"
            });
          } else {
            console.log("File Uploaded!");

            uploadToS3(req.file.filename)
              .then((awspath) => {
                res.send({
                  msg: "File uploaded successfully",
                  code: "FILE_UPLOADED",
                  file: `${req.file.filename}`,
                  path: awspath,
                });
              })
              .catch((err) => {
                console.log('Error uploading to AWS S3', err);
                res.send({
                  msg: "File could not be uploaded to S3",
                  code: "FILE_REMOTE_FAIL",
                  file: `${req.file.filename}`,
                });
              })
          }
        }
      });
    });

    return app;
  }
}

module.exports = new Uploader().handler();
