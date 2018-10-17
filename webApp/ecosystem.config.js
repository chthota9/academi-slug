module.exports = {
  apps : [{
    name      : 'Academi-Slug',
    script    : 'server.js',
    env: {
      NODE_ENV: 'development',
      GOOGLE_CLIENT_ID: '675450206162-bo2tctf8cf17ba5mdgatgduho9cibi0e.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'UaTfkdsuXOEHhYwauDs60VCU',
      PORT: 5000,
      GOOGLE_HAVEP_CALLBACK: `http://localhost:5000/google/login`,
      GOOGLE_CREATEP_CALLBACK: `http://localhost:5000/google/signup`,
      SECRET:'slugger'
    },
    env_production : {
      NODE_ENV: 'production',
      GOOGLE_CLIENT_ID: '675450206162-bo2tctf8cf17ba5mdgatgduho9cibi0e.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'UaTfkdsuXOEHhYwauDs60VCU',
      GOOGLE_CALLBACK: "http://aimxex.com/profile/cb",
      GOOGLE_HAVEP_CALLBACK: `https://aimxex.com/google/login`,
      GOOGLE_CREATEP_CALLBACK: `https://aimxex.com/google/signup`,
      PORT: 5000,
      SECRET:'slugger'
    }
  }]
};
