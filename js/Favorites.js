// classe para obter e guardar dados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    };
    
    load() {
        this.entries = [
            {
                login: "maykbrito",
                name: "Mayk Brito",
                public_repos: "98",
                followers: "12k",      
            },
            {
                login: "Nop-Dev",
                name: "Yuri Sousa",
                public_repos: "33",
                followers: "12"    ,        
            }
        ]
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login); 
        
        console.log(filteredEntries)
    }
};

// classe pra construir o HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root);

        this.tbody = this.root.querySelector("table tbody");

        this.update();
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
               }    
            };
 
            this.tbody.append(row);
        })
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
    `
        tr.innerHTML = content;

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
            tr.remove();
        });
    };
};