import '@babel/polyfill'
import {login} from './login'
import { createMap } from './mapBox';
import { logout } from './logout';
import { updateImage, updateUser } from './updateUser';
import { updatePassword } from './updateUser';
import { showAlert } from './alert';
import { bookTour } from './stripe';
import { signUpUser } from './signup';

let locations=document.querySelector('#map')?.getAttribute('data-location');
if(locations){
   locations= JSON.parse(locations)
createMap(locations)
}

document.querySelector('.form-login')?.addEventListener('submit',e=>{
    e.preventDefault();
    const email=document.querySelector('#email.form__input').value;
    const password=document.querySelector('#password.form__input').value;

    login(email,password);
})


document.querySelector('.nav__el--logout')?.addEventListener('click',e=>{
    e.preventDefault();
    logout();
})

document.querySelector('.btn--updateMe')?.addEventListener('click',(e)=>{
  e.preventDefault();
   const form=new FormData();

    form.append('email',document.querySelector('.confirming-email').value);
    form.append('name',document.querySelector('.confirming-name').value);
    form.append('photo',document.querySelector('.uploadphoto').files[0])

    updateUser(form);
})


document.querySelector('.savePassword')?.addEventListener('click',(e)=>{
    e.preventDefault();
    const currPassword=document.querySelector('#password-current').value;

    const newPassword=document.querySelector('#password').value;
    const newConfirm=document.querySelector('#password-confirm').value;

    updatePassword(currPassword,newPassword,newConfirm).then(()=>{
        document.querySelector('#password-current').value='';
        document.querySelector('#password').value='';
        document.querySelector('#password-confirm').value='';
    }).catch(err=>showAlert('error',err.message));
})


const btnBookings=document.querySelector('#bookTour');

btnBookings?.addEventListener('click',e=>{
    e.preventDefault();
    e.target.textContent='processing...'
   
    let tourId=e.target.getAttribute('data-tourId'); // tour-id from pug will be converted to tourId in js

    bookTour(tourId);
})


const signup=document.querySelector('.Signup');

signup?.addEventListener('click',(e)=>{
    window.location.href='/signup'
})

const singupForm=document.querySelector('.Signup-form');

singupForm?.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const email=document.querySelector('.email_Signup').value;
    const name=document.querySelector('.name_Signup').value;
    const password=document.querySelector('.password_Signup').value;
    const confirmPassword=document.querySelector('.Confirmpassword_Signup').value
    signUpUser(email,name,password,confirmPassword)
})