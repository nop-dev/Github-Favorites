// classe pra buscar os dados na api do github
import { GithubUser } from "./GithubUser.js";

// classe para obter e guardar dados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();

        GithubUser.search("Nop-Dev").then(user => console.log(user));
    };
    
    load() {
        this.entries = JSON.parse(localStorage.getItem
        ('@github-favorites:')) || [];
    };

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
    };

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username);

            if(userExists) {
                throw new Error('Usuário já cadastrado...');
            };

            const user = await GithubUser.search(username);

            console.log(user);

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado, tente novamente...');
            };

            this.entries = [user, ...this.entries];
            this.update();

        } catch(error) {
            alert(error.message);
        };
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

            this.save();
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