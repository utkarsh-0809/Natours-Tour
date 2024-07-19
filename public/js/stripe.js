import axios from 'axios';
import { showAlert } from './alert';

const stripe=Stripe('pk_test_51PZoc3JXB0z12BP0HmDKKFINyaQIT8wlOXCnp4fg3pUcQKIbilVL5oR5kvSO8nweuq8lx34D4zbbJwpvOLPBn22I00eietco9o')


export const bookTour=async tourId=>{
    
    console.log('heloooooo',tourId);
    try{
    const session=await axios(`http://localhost:8000/api/v1/booking/checkout-session/${tourId}`)
    //console.log(session);
    
    await stripe.redirectToCheckout({
        sessionId:session.data.session.id
    });
    
        showAlert('success','Your payment was successful');
    
    }
    catch(err){
        showAlert('error',err)
    }
}