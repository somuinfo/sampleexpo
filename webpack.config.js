const path = require('path');
const HWP = require('html-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');
const fs = require('fs'); // to check if the file exists
 // call dotenv and it will return an Object with a parsed key 
 

module.exports = env => {
    // Get the root path (assuming your webpack config is in the root of your project!)
  const currentPath = path.join(__dirname);
  
  // Create the fallback path (the production .env)
  const basePath = currentPath + '/.env';

  // We're concatenating the environment name to our filename to specify the correct env file!
  const envPath = basePath + '.' + env.ENVIRONMENT;

  // Check if the file exists, otherwise fall back to the production .env
  const finalPath = fs.existsSync(envPath) ? envPath : basePath;
   const fileEnv = dotenv.config({ path: finalPath }).parsed;
const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
   console.log(fileEnv[next]);
   prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
   return prev;
 }, {});
 console.log(fileEnv);
 console.log(envKeys);
   return{
        entry: path.join(__dirname, '/src/index.js'),
        output: {
           filename: 'build.js',
            path: path.join(__dirname, '/dist')},
           module:{
           rules:[{
              test: /\.js$/,
      exclude: /node_modules/,
           loader: 'babel-loader'
        },
        {
         test: /\.css$/i,
         use: ['style-loader', 'css-loader'],
         }
      ]
    },
    plugins:[
        new HWP(
           {template: path.join(__dirname,'/src/index.html')}
        ),
        new webpack.DefinePlugin(
         {
            'process.env': envKeys
         })
    ]   
 }
}
    "start": "webpack-dev-server --env.ENVIRONMENT=stage --open --hot",
