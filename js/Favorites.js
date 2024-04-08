// classe pra buscar os dados na api do github
export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(({ name, login, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}

// classe para obter e guardar dados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();

        GithubUser.search("Nop-Dev").then(user => console.log(user))
    };
    
    load() {
        this.entries = JSON.parse(localStorage.getItem
        ('github-favorites:')) || [];
    };

    
    async add(username) {
        const user = await GithubUser.search(username);

        console.log(user)
    };

    delete(user) {
        this.entries = this.entries.filter(entry => entry.login !== user.login); 
        
        this.update();
    };
};

// classe pra construir o HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root);

        this.tbody = this.root.querySelector("table tbody");

        this.update();
        this.onadd();
    };

    onadd() {
        const addButton = this.root.querySelector("#searchbtn");
        addButton.onclick = () => {
            const { value } = this.root.querySelector("#search input"); 

            this.add(value);
        };
    };

    update() {
        this.removeAllTr();

        this.entries.forEach( user => {
            const row = this.createRow();

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
            row.querySelector('.user img').alt = `Imagem de ${user.login}/${user.name}`;
            row.querySelector('.user a').href = `https://github.com/${user.login}`;
            row.querySelector('.user p').textContent = `${user.name}`;
            row.querySelector('.user span').textContent = `${user.login}`;
            row.querySelector('.repositories').textContent = `${user.public_repos}`;
            row.querySelector('.followers').textContent = `${user.followers}`;

            row.querySelector('.remove').onclick = () => {
               const isOk = confirm('Tem certeza que quer deletar essa linha?');
            if(isOk) {
                this.delete(user);
               };    
            };
 
            this.tbody.append(row);
        });
    };

    createRow() {
        const tr = document.createElement('tr');

        const content = `
           <td class="user">
               <img src="" alt="">
               <a href="" target="_blank">
                   <p></p>
                    <span></span>
               </a>
            </td>
            <td class="repositories"></td>
            <td class="followers"></td>
            <td>
                <button class="remove">&times;</button>
            </td>
    `;
        tr.innerHTML = content;

        return tr;
    };

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
            tr.remove();
        });
    };
};