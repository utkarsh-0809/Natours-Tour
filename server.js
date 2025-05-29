const dotenv=require('dotenv');
dotenv.config({path:'./config.env'})
const app=require('./app');
const mongoose=require('mongoose');

let db=process.env.DATABASE.replace('<password>',process.env.PASSWORD);
try{
mongoose.connect(db, {
  useNewUrlParser: true,         // modern connection string parser
  useCreateIndex: true,          // use createIndex instead of deprecated ensureIndex
  useUnifiedTopology: true,      // better server discovery & monitoring
  useFindAndModify: false        // use modern update methods
})
.then(()=>console.log('mongodb connected successfully'));
}
catch(err){
    console.log(err.message);
}


const port=8000;
app.listen(port,()=>{

    console.log(`${process.env.NAME}'s server started`);
});



