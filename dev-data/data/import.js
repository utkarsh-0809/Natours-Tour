const dotenv=require('dotenv');
dotenv.config({path:'./config.env'})
const fs=require('fs');
const mongoose=require('mongoose');
const Tour=require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');


let db=process.env.DATABASE.replace('<password>',process.env.PASSWORD);
console.log(process.env.DATABASE)
try{
mongoose.connect(db ,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>console.log('mongobd connected successfully'));
}
catch(err){
    console.log(err.message);
}


let tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
let users=JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
let reviews=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));

async function importData(){
    try{
   await Tour.create(tours);
   await User.create(users,{validateBeforeSave:false});
   await Review.create(reviews)
    }
    catch(err){
        console.log(err);
    }
}



async function deleteFirst(){
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();        
        importData();
    }
    catch(err){
        console.log(err);
    }
}

deleteFirst();

