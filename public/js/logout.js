import { showAlert } from "./alert";
import axios from "axios";
export async function logout(){
    // console.log(email,password)
    // console.log('done')
    // console.log('checking...1')
    try{
     const res= await axios({
        method:'GET',
        url:'/api/v1/user/logout',
        // this will work on deployed version because both 
        // backend and frontend will be on same domain
        
      })
      // console.log('checking...')
   showAlert('success','Logged out successfully');

      window.setTimeout(()=>{
        window.location.href='/'
      },500)
    }
      catch (err){
        showAlert('error',err.response?.data)
      }
}
