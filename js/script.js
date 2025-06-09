document.addEventListener('DOMContentLoaded', () => {
    const todoInputs = document.querySelectorAll('.todo-input');
    const todosLists = document.querySelectorAll('.todos-list');
    const searchInput = document.getElementById('searchInput'); //  recupere l'input de la recherche
    const statutMap = ['urgent', 'important', 'apres'];

    // fonction quisert ajouter une tache
    function addTodo(text, columnIndex) {
        const statut = statutMap[columnIndex];

        fetch('http://localhost:8003/php/add.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contenu: text, statut: statut })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadTodos();
            } else {
                alert("Erreur ajout : " + data.error);
            }
        });
    }

    // Supprimer une tache
    function deleteTodo(id) {
        fetch('http://localhost:8003/php/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadTodos();
            } else {
                alert("Erreur suppression : " + data.error);
            }
        });
    }

    // Modifier une tache
    function editTodo(id, oldText) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = oldText;
        input.className = 'edit-input';

        const save = () => {
            const newText = input.value.trim();
            if (!newText || newText === oldText) {
                loadTodos();
                return;
            }

            fetch('http://localhost:8003/php/edit.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, contenu: newText })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    loadTodos();
                } else {
                    alert("Erreur modification : " + data.error);
                }
            });
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') save();
        });
        input.addEventListener('blur', save);

        return input;
    }

    // Charger toutes les taches
    function loadTodos() {
        fetch('http://localhost:8003/php/get.php') // recupere le contenue du get.php
        .then(res => res.json())
        .then(taches => {
            const searchValue = searchInput.value.toLowerCase(); // texte tape, SearchInput la variable au debut qui recupere le text a l'input

            todosLists.forEach(list => list.innerHTML = '');

            taches.forEach(tache => {
                const columnIndex = statutMap.indexOf(tache.statut.toLowerCase());
                if (columnIndex === -1) return;

                // filtrage par contenu de la tache lors de la recherche hehehe en recuperant SearchValue (le text tape)
                if (!tache.contenu.toLowerCase().includes(searchValue)) return;

                const todoElement = document.createElement('div');
                todoElement.className = 'todo-item';

                const span = document.createElement('span');
                span.textContent = tache.contenu;

                // Bouton modifier ~
                const editBtn = document.createElement('button');
                editBtn.textContent = '✎';
                editBtn.className = 'edit-btn';
                editBtn.onclick = () => {
                    const input = editTodo(tache.id, tache.contenu);
                    todoElement.innerHTML = '';
                    todoElement.appendChild(input);
                    input.focus();
                };

                // Bouton supprimer x
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '🗑';
                deleteBtn.className = 'delete-btn';
                deleteBtn.onclick = () => deleteTodo(tache.id);

                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'todo-buttons';
                buttonsDiv.appendChild(editBtn);
                buttonsDiv.appendChild(deleteBtn);

                todoElement.appendChild(span);
                todoElement.appendChild(buttonsDiv);

                todosLists[columnIndex].appendChild(todoElement);
            });
        });
    }

    // Ajouter une tche avec Enter
    todoInputs.forEach((input, index) => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                addTodo(input.value.trim(), index);
                input.value = '';
            }
        });
    });

    // Recharger a chaque frappe dans la recherche
    searchInput.addEventListener('input', loadTodos);

    loadTodos(); // Initialisation
});
