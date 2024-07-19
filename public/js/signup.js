import axios from 'axios';
import { showAlert } from './alert';

export async function signUpUser(email,name,password,passwordConfirm){
    // console.log(email,password)
    // console.log('done')
    try{
     const res= await axios({
        method:'POST',
        url:'http://localhost:8000/api/v1/user/signup',
        data:{
            email,
            name,
            password,
            passwordConfirm
        }
       
      })
      // console.log('watching1');
      // console.log(showAlert);
      // console.log(res);
      // console.log('watching2');
    
    showAlert('success','signed in successfully');
     //console.log('still watching')
      window.setTimeout(()=>{
        window.location.href='/'
      },1000)
    }
      catch (err){
        showAlert('error',`${err.message}`)
    //   console.log('caught it')
      }
}