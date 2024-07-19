

 function removeAlert(){
    const el=document.querySelector('.alert');
    if(el){
        el.parentElement.removeChild(el)
    }
}
export const showAlert=(type,message)=>{

    try{
       // console.log('init1')
        removeAlert();
       // console.log('init2')
        const html=`<div class="alert alert--${type}">${message}</div>`;
     //   console.log('init3');
        document.querySelector('body').insertAdjacentHTML('afterbegin',html);
    window.setTimeout(()=>{
        removeAlert();
    },5000)
}
catch(err){
    console.log(err);
}
}