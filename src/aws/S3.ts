import AWS from 'aws-sdk';

let credentials = new AWS.Credentials(
    {
        accessKeyId: process.env.ACCESS_KEY as string, 
        secretAccessKey: process.env.SECRET_KEY as string
    });
    
AWS.config.update({region: process.env.BUCKET_REGION, credentials});

const s3 = new AWS.S3();

export default s3;