const allIssue=() => {
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        console.log(data.data);
        displayIssue(data.data);
    });
};

const displayIssue = (issues)=>{
     issues.forEach((issue) =>{
        console.log(issue);
    });
}
allIssue();