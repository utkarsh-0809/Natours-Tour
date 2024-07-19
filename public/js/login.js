import axios from 'axios';
import { showAlert } from './alert';

export async function login(email,password){
    // console.log(email,password)
    // console.log('done')
    try{
     const res= await axios({
        method:'POST',
        url:'http://localhost:8000/api/v1/user/login',
        data:{
            email,
            password
        }
       
      })
      // console.log('watching1');
      // console.log(showAlert);
      // console.log(res);
      // console.log('watching2');
    
    showAlert('success','Logged in successfully');
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

// document.querySelector('.form').addEventListener('submit',e=>{
//     e.preventDefault();
//     const email=document.querySelector('#email.form__input').value;
//     const password=document.querySelector('#password.form__input').value;

//     send(email,password);
// })