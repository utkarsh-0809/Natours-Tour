import { showAlert } from "./alert";
import axios from "axios";
export async function logout(){
    // console.log(email,password)
    // console.log('done')
    console.log('checking...1')
    try{
     const res= await axios({
        method:'GET',
        url:'http://localhost:8000/api/v1/user/logout',
        
      })
      console.log('checking...')
   showAlert('success','Logged out successfully');

      window.setTimeout(()=>{
        window.location.href='/'
      },1000)
    }
      catch (err){
        showAlert('error',err.response?.data)
      }
}
