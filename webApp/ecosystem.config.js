module.exports = {
  apps : [{
    name      : 'Academi-Slug',
    script    : 'server.js',
    env: {
      NODE_ENV: 'development',
      GOOGLE_CLIENT_ID: '675450206162-bo2tctf8cf17ba5mdgatgduho9cibi0e.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'UaTfkdsuXOEHhYwauDs60VCU',
      PORT: 5555,
      GOOGLE_CALLBACK: "http://localhost:5555/profile/cb",
      SECRET:'slugger'
    },
    env_production : {
      NODE_ENV: 'production',
      GOOGLE_CLIENT_ID: '675450206162-bo2tctf8cf17ba5mdgatgduho9cibi0e.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'UaTfkdsuXOEHhYwauDs60VCU',
      GOOGLE_CALLBACK:"http://academislug.ddns.net/profile/cb",
      PORT: 3645,
      SECRET:'slugger'
    }
  }]
};
