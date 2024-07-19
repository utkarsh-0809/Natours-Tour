const mongoose=require('mongoose');

let bookingSchema= new mongoose.Schema({
    tour:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tour',
        required:[true,'tour is a required field']
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'user is a required field']
    },
    price:{
        type:Number,
        required:[true,'a Booking must have a price']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
})

bookingSchema.pre(/^find/,function(next){
     this.populate({
        path:'user',
        select:'id name'
     }).populate({
        path:'tour',
        select:'id name price'
     })

    next();
})

const Booking=mongoose.model('Bookings',bookingSchema);

module.exports=Booking;