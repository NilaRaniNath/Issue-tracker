const homePage = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
let allIssues = [];
let currentTab = "all";

window.onload = function () {
    loadAllIssues();

};








async function loadAllIssues() {
    showSpinner();
    try {
        const response = await fetch(homePage);
        const data = await response.json();
        allIssues = Array.isArray(data) ? data : (data.issues || data.data || []);
        displayIssues(allIssues);
    } catch (error) {
        showError("Failed to load issues.");
    }
};



function switchTab(tabName) {
    currentTab = tabName;
    const allTabButtons = document.querySelectorAll(".tab-btn");
    allTabButtons.forEach(btn => {
        btn.classList.replace("btn-primary", "btn-outline");
    });

    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.replace("btn-outline", "btn-primary");
    }
    displayIssues(getFilteredIssues());
}

function getFilteredIssues() {
    if (currentTab === "open") return allIssues.filter(i => i.status.toLowerCase() === "open");
    if (currentTab === "closed") return allIssues.filter(i => i.status.toLowerCase() === "closed");
    return allIssues;
}





function displayIssues(issues) {
    const grid = document.getElementById("issueGrid");
    document.getElementById("issueCount").textContent = `${issues.length} Issues`;

    if (issues.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-24 text-5xl">🔍</div>`;
        return;
    }

    grid.innerHTML = "";
    issues.forEach((issue, index) => {
        grid.appendChild(createCard(issue, index));
    });
}



function createCard(issue, index) {
    const status = (issue.status || "open").toLowerCase();
    const priority = (issue.priority || "LOW").toUpperCase();
    
    const priorityClass = {
        HIGH: "badge-error",
        MEDIUM: "badge-warning",
        LOW: "badge-ghost",
    }[priority] || "badge-ghost";

    const card = document.createElement("div");
    card.className = `card bg-base-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer fade-up ${status === 'open' ? 'card-open' : 'card-closed'}`;
    card.style.animationDelay = `${Math.min(index * 40, 400)}ms`;

    
    card.innerHTML = `
        <div class="card-body p-4 gap-3">
            <div class="flex items-center justify-between">
                <span class="text-xl">${status === "open" ? "🔄" : "✅"}</span>
                <span class="badge badge-sm ${priorityClass} font-bold">${priority}</span>
            </div>
            <h2 class="issue-title font-bold text-base leading-snug line-clamp-2 logo-text"></h2>
            <p class="issue-desc text-sm text-base-content/60 line-clamp-2 leading-relaxed"></p>
            <div class="flex flex-wrap gap-1">${createLabelsHTML(issue.labels || [])}</div>
            <p class="text-xs text-base-content/40 mt-auto">#${issue.id || "—"} by <span class="author-name"></span> · ${formatDate(issue.createdAt)}</p>
        </div>
    `;

    
    card.querySelector(".issue-title").textContent = issue.title || "Untitled";
    card.querySelector(".issue-desc").textContent = issue.description || issue.body || "";
    card.querySelector(".author-name").textContent = issue.author || "unknown";

    card.onclick = () => openModal(issue);
    return card;
}

function createLabelsHTML(labels) {
    return labels.map(label => {
        const name = typeof label === "string" ? label : (label.name || "");
        return `<span class="badge badge-sm badge-outline">${name.toUpperCase()}</span>`;
    }).join("");
}


function openModal(issue) {
    const modalContent = document.getElementById("modalContent");
    const status = (issue.status || "open").toLowerCase();
    const priority = (issue.priority || "LOW").toUpperCase();

    let customClass = priority === "HIGH" ? "bg-red-600 text-white" : 
                      priority === "MEDIUM" ? "bg-yellow-500 text-black" : "bg-green-400 text-white";

    modalContent.innerHTML = `
        <span class="badge ${status === 'open' ? 'badge-success' : 'badge-secondary'} mb-2">
            ${status === 'open' ? '● Opened' : '● Closed'}
        </span>
        <p class="text-xs text-base-content/50 mb-3">Opened by <span id="m-assignee"></span> • ${formatDate(issue.createdAt)}</p>
        <h3 id="m-title" class="text-xl font-extrabold logo-text mb-3"></h3>
        <div class="flex flex-wrap gap-1 mb-4">${createLabelsHTML(issue.labels || [])}</div>
        <p id="m-desc" class="text-sm text-base-content/70 leading-relaxed mb-5"></p>
        <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-base-200 rounded-xl p-3">
                <p class="text-xs text-base-content/50 mb-1">Assignee</p>
                <p id="m-assignee-val" class="font-semibold text-sm"></p>
            </div>
            <div class="bg-base-200 rounded-xl p-3">
                <p class="text-xs text-base-content/50 mb-1">Priority</p>
                <span class="badge badge-sm ${customClass} font-bold">${priority}</span>
            </div>
        </div>
        <div class="flex justify-end">
            <button class="btn btn-primary btn-sm" onclick="closeModal()">Close</button>
        </div>
    `;

   
    document.getElementById("m-assignee").textContent = issue.assignee || issue.author || "unknown";
    document.getElementById("m-title").textContent = issue.title || "Untitled";
    document.getElementById("m-desc").textContent = issue.description || issue.body || "No description provided.";
    document.getElementById("m-assignee-val").textContent = issue.assignee || issue.author || "unknown";

    document.getElementById("issueModal").showModal();
}

function closeModal() {
    document.getElementById("issueModal").close();
}

function showSpinner() {
    document.getElementById("issueGrid").innerHTML = `<div class="col-span-full flex flex-col items-center py-24 gap-4"><div class="spinner"></div><p>Loading...</p></div>`;
}

function showError(msg) {
    document.getElementById("issueGrid").innerHTML = `<div class="col-span-full text-center py-24">⚠️ ${msg}</div>`;
}

function formatDate(str) {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

document.getElementById("search-btn").addEventListener("click",()=>{
  const searchInput=document.getElementById("search-input");
  const searchValue=searchInput.value.trim().toLowerCase();
  // console.log(searchValue);
   fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`)
   .then(res=>res.json())
  .then(data=>{
    const allData=data.data;
    const filterData= allData.filter(data=>data.title.toLowerCase().includes(searchValue))
    displayIssues(filterData);
  })
  });
