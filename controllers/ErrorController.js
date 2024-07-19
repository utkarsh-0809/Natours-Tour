const apiError=require('../utils/apiError');
function sendErrorDev(err,req,res){
    if(req.originalUrl.startsWith('/api')){
     res.status(err.statusCode)
    .json({
      status:err.status,
      message:err.message,
      stack:err.stack,
      error:err
    })
    }
    else{
        res.render('error',{
            msg:err.message
        })
    }
}

function sendErrProd(err,res){
    if(req.originalUrl.startsWith('/api')){
    if(err.isOperational){
        res.status(err.statusCode)
    .json({
      status:err.status,
      message:err.message
    })
    }

    else{
        console.error('Erorrrrrrrr',err)

        res.status(err.statusCode)
        .json({
            status:err.status,
            message:`aljgkfnjg    ${err.message} jkdng`
        })
    }
}
  else{
    res.render('error',{
        msg:'Something went wrong please try again'
    })

  }
}

const handleCastErrorDb=(error)=>{
   const message=`Invalid path ${error.path}: ${error.value}.`;
     
   return new apiError(message,400);
}

 function handleDuplicateFields(error){
    const value=error.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

    const message=`Duplicate field value:${value}.please use another value`;

    return new apiError(message,400);
 }

 function handleValidatonError(error){
   
    const errors=Object.values(error.errors).map(val=>val.message);

    const message=`Invalid input data: ${errors.join('. ')}`

    return new apiError(message,400);
 }
 function handleJwtError(){
    return new apiError('invalid token, please login again',401)
 }
 function handleJwtExpire(){
    return new apiError('token expired please login again',401)
 }

module.exports=(err,req,res,next)=>{
    err.status=err.status || 'error';
     err.statusCode=err.statusCode||500;

    if(process.env.NODE_ENV==='development'){
        sendErrorDev(err,req,res);

    }
    else{
        let error=Object.assign({}, err)
        error.message=err.message
        if(err.name==='CastError')
            error=handleCastErrorDb(error);

        if(err.code===11000)
            error=handleDuplicateFields(err);

        if(err.name==='ValidationError')
            error=handleValidatonError(err);

        if(err.name==='JsonWebTokenError')
            error=handleJwtError();
        if(err.name==='TokenExpiredError')
            error=handleJwtExpire();
         
        sendErrProd(error,res);
        
    }

    
  };