import axios from "axios"
import { showAlert } from "./alert"

export const updateUser=async(data)=>{
    try{
    
      const res=  await axios({
            method:'PATCH',
            url:'http://localhost:8000/api/v1/user/updateMe',
            data
        })
        window.location.href='/account';
       
        showAlert('success','updted succuessfully');
    }
    catch(err){
        showAlert('error',err.message);
    }
}

export const updatePassword=async(currPassword,newPassword,newConfirm)=>{
    try{
        
      const res=  await axios({
            method:'PATCH',
            url:'http://127.0.0.1:8000/api/v1/user/updatePassword',
            data:{
               password:currPassword,
               newpassword:newPassword,
               passwordConfirm:newConfirm
            }
        })
        console.log(res);
       
        showAlert('success','updted succuessfully');
    }
    catch(err){
        showAlert('error',err.message);
    }
}



export const updateImage=async(url)=>{
    try{
        
      const res=  await axios({
            method:'PATCH',
            url:'http://127.0.0.1:8000/api/v1/user/updateMe',
            data:{
               
            }
        })
        console.log(res);
       
        showAlert('success','updted succuessfully');
    }
    catch(err){
        showAlert('error',err.message);
    }
}

