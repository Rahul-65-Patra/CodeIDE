const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/codeIDE");

const projectSchema = new mongoose.Schema({
  title: String,
  createdBy: String,
  date: {
    type: Date,
    default: Date.now,
  },
  htmlCode: {
    type: String,
    default: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeEditoe</title>
  </head>
  <body>
  <h1>Hello World</h1>
  </body>
</html>`,
  },
  cssCode: {
    type: String,
    default: `h1{color:red}`,
  },
  jsCode: {  
    type: String,
    default: 'console.log("Hello World")',
  },
});

module.exports = mongoose.model("Project", projectSchema); // Project is the name of the collection
