// overview div is where your profile info will appear
const overview = document.querySelector(".overview")
const username = "Abigail-Carey";
const repoList = document.querySelector(".repo-list");
const repoInfoAppear = document.querySelector(".repos");
const indivRepoData = document.querySelector(".repo-data");
const backButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const getData = async function () {
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    //console.log(data);
    displayData(data);
};
getData();

const displayData = function (data) {
    const div = document.createElement("div");
    div.classList.add(".user-info");
    div.innerHTML = `
        <figure>
            <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Bio:</strong> ${data.bio}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>
    `;
    overview.append(div);
    fetchRepo();
};

const fetchRepo = async function () {
    const repoInformation = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await repoInformation.json();
    displayRepo(repoData);
};

const displayRepo = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getSpecificRepo(repoName);
    };
});

const getSpecificRepo = async function (repoName) {
    const grabRepoInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await grabRepoInfo.json();
    console.log(repoInfo);

    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    //console.log(languageData);


    const languages = [];
    for (let eachLanguage in languageData) {
        languages.push(eachLanguage);
        }

        displayRepoInfo(repoInfo, languages);
    };

const displayRepoInfo = function (repoInfo, languages){
    backButton.classList.remove("hide");
    indivRepoData.innerHTML = "";
    indivRepoData.classList.remove("hide");
    repoInfoAppear.classList.add("hide")
    const div = document.createElement("div");
    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_brance}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    indivRepoData.append(div);
};

backButton.addEventListener("click", function () {
    repoInfoAppear.classList.remove("hide");
    indivRepoData.classList.add("hide");
    backButton.classList.add("hide");
});

filterInput.addEventListener("input", function(e) {
    const captureText = e.target.value;
    //console.log(captureText);
    const repos = document.querySelectorAll(".repo");
    const lowerCase = captureText.toLowerCase();


    for (const eachRepo of repos) {
        const lowercaseText = eachRepo.innerText.toLowerCase();
        if (lowercaseText.includes(lowerCase)) {
            eachRepo.classList.remove("hide");
        } else {
            eachRepo.classList.add("hide");
        };
    }
})
