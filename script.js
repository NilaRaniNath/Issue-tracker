
document.getElementById("sign-in").addEventListener("click",function(event){
    event.preventDefault();
        const nameInput=document.getElementById("input-name");
    const userName=nameInput.value;
    // console.log(userName);


    const passInput=document.getElementById("input-pass");
    const password=passInput.value;
    // console.log(passsword);

    if(userName=="admin" && password== "admin123"){
        console.log("log in success")
        window.location.assign("./homepage.html");
    }
    else{
        alert("login Failed");
        
    }
})


