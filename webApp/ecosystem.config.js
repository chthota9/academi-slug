module.exports = {
  apps : [{
    name      : 'Academi-Slug',
    script    : 'server.js',
    env: {
      NODE_ENV: 'development',
      GOOGLE_CLIENT_ID: '675450206162-bo2tctf8cf17ba5mdgatgduho9cibi0e.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'UaTfkdsuXOEHhYwauDs60VCU',
      GOOGLE_HAVEP_CALLBACK: `http://localhost:5000/google/login`,
      GOOGLE_CREATEP_CALLBACK: `http://localhost:5000/google/signup`,
      SECRET:'slugger'
    },
    env_production : {
      NODE_ENV: 'production',
      GOOGLE_CLIENT_ID: '675450206162-bo2tctf8cf17ba5mdgatgduho9cibi0e.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'UaTfkdsuXOEHhYwauDs60VCU',
      GOOGLE_HAVEP_CALLBACK: `https://academi-slug.herokuapp.com/google/login`,
      GOOGLE_CREATEP_CALLBACK: `https://academi-slug.herokuapp.com/google/signup`,   
      SECRET:'slugger'
    }
  }]
};
