const dotenv=require('dotenv');
dotenv.config({path:'./config.env'})
const app=require('./app');
const mongoose=require('mongoose');

let db=process.env.DATABASE.replace('<password>',process.env.PASSWORD);
try{
mongoose.connect(db ,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>console.log('mongodb connected successfully'));
}
catch(err){
    console.log(err.message);
}


const port=8000;
app.listen(port,()=>{

    console.log(`${process.env.NAME}'s server started`);
});



