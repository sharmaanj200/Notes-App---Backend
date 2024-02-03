const mongoose = require('mongoose');

const mongoDB = process.env.NODE_ENV==='test' ?  
                process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(mongoDB)
 .then(() => process.env.NODE_ENV !== 'test' && console.log("Mongodb connected successfully..."))
 .catch((err) => console.log(err));

module.exports = mongoose;