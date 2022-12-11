const axios = require('axios');

const API_URL = 'https://api.github.com/users';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const getUsers = async (username) => {
    try {
        const { data } = await axios(API_URL + '/' + username);
        createUserCard(data);
        getRepos(username);
    } catch (err) {
        if (err.response.status == 404) {
        createErrorCard('No profile with this username');
        }
    }
}

const getRepos = async (username) => {
    try {
        const { data } = await axios(API_URL + '/' + username + '/repos?sort=created');
        addReposToCard(data);
    } catch (err) {
        createErrorCard('Problem fetching repos');
    }
}

const createUserCard = (user) => {
   const userID = user.id || user.login;
   const userBio = user.bio || /*html*/`<p>${user.bio}</p>`;
   const cardHtml = /*html*/`
    <div class="card">
        <div>
            <img class="avatar" src="${user.avatar_url}" alt="${user.name}" />
        </div>
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>

            <ul>
                <li>${user.followers} <strong>Followers</strong></li>
                <li>${user.following} <strong>Following</strong></li>
                <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>

            <div id="repos"></div>
        </div>
    </div>`

    main.innerHTML = cardHtml;
};

const createErrorCard = (msg) => {
    const cardHtml = /*html*/`
    <div class="card">
        <h1>${msg}</h1>
    </div>`;

    main.innerHTML = cardHtml;
}

const addReposToCard = (repos) => {
    const reposEl = document.getElementById('repos');

    repos
        .slice(0, 10)
        .forEach(repo => {
            const repoEl = document.createElement('a');
            repoEl.classList.add('repo');

            repoEl.href = repo.html_url;
            repoEl.target = '_blank';
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUsers(user);

        search.value = '';
    }
})