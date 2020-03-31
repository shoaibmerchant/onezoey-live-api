/**
 * The AWS configuration will be specified below, uses aws-sdk
 */

const aws = {
  local: {
    key: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_SECRET,
    bucket: {
      name: process.env.AWS_S3BUCKET_NAME,
      region: process.env.AWS_S3BUCKET_REGION
		}
  },
	development: {
    key: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_SECRET,
    bucket: {
      name: process.env.AWS_S3BUCKET_NAME,
      region: process.env.AWS_S3BUCKET_REGION
		}
  },
  production: {
    key: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_SECRET,
    bucket: {
      name: process.env.AWS_S3BUCKET_NAME,
      region: process.env.AWS_S3BUCKET_REGION
		}
	}
};

export default aws;