
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
        window.location.assign("./home.html");
    }
    else{
        alert("login Failed");
        
    }
})



// home page ...............


const allIssue=() => {
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        displayIssue(data);
    });
};

const displayIssue = (issues)=>{
     issues.forEach((issue) =>{
        console.log(issue);
    });
}
allIssue();