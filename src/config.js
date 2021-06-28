const config = {
    s3: {
      REGION: "ap-southeast-2",
      BUCKET: "notes-app-upload-tritran",
    },
    apiGateway: {
      REGION: "ap-southeast-2",
      URL: "https://krl9z0ig6c.execute-api.ap-southeast-2.amazonaws.com/prod/",
    },
    cognito: {
      REGION: "ap-southeast-2",
      USER_POOL_ID: "ap-southeast-2_arTVuzWEl",
      APP_CLIENT_ID: "4a4jf5nu8l0s3vve7b7v8ekl2s",
      IDENTITY_POOL_ID: "ap-southeast-2:01bfa4dc-4f51-4ad4-beef-367fb11710d2",
    },
    maxAttachmentSize: 5000000,
  };
  
  export default config;