$(document).ready(function (){
    const socket = io();
    socket.on("connect_error", err => {
        console.log(err instanceof Error); // true
        console.log(err.message); // not authorized
        console.log(err.data); // { content: "Please retry later" }
    });
    let redirecting = false;
    
    socket.on('response.registration',async function(){
            redirecting = true;
            location.href='/my/dashboard'
        });
    window.setInterval(function(){
        if(!redirecting){
            socket.emit('request.registration');
        }
      }, 1000);
})