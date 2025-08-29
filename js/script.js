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

                // Configurer le drag & drop pour cet élément
                setupDragAndDrop(todoElement, tache.id);

                todosLists[columnIndex].appendChild(todoElement);

                // ===== FONCTIONNALITÉ DRAG & DROP =====

                // Fonction pour changer le statut d'une tâche
                function changeTaskStatus(taskId, newStatus) {
                    fetch('http://localhost:8003/php/change_status.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: taskId, statut: newStatus })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            // Animation de succès
                            loadTodos();
                        } else {
                            alert("Erreur changement de statut : " + data.error);
                            loadTodos();
                        }
                    })
                    .catch(error => {
                        console.error('Erreur:', error);
                        alert("Erreur de connexion lors du changement de statut");
                        loadTodos();
                    });
                }

                // Fonction pour configurer le drag & drop sur un élément todo
                function setupDragAndDrop(todoElement, taskId) {
                    todoElement.draggable = true;
                    todoElement.dataset.taskId = taskId;

                    // Événements de drag
                    todoElement.addEventListener('dragstart', (e) => {
                        todoElement.classList.add('dragging');
                        e.dataTransfer.setData('text/plain', taskId);
                        e.dataTransfer.effectAllowed = 'move';
                        
                        // Ajouter des indicateurs visuels aux zones de drop
                        document.querySelectorAll('.column').forEach(col => {
                            col.classList.add('valid-drop-target');
                        });
                    });

                    todoElement.addEventListener('dragend', () => {
                        todoElement.classList.remove('dragging');
                        
                        // Retirer les indicateurs visuels
                        document.querySelectorAll('.column').forEach(col => {
                            col.classList.remove('valid-drop-target');
                        });
                        document.querySelectorAll('.todos-list').forEach(list => {
                            list.classList.remove('drag-over');
                        });
                    });
                }

                // Configuration des zones de drop
                function setupDropZones() {
                    todosLists.forEach((todosList, columnIndex) => {
                        const statut = statutMap[columnIndex];

                        todosList.addEventListener('dragover', (e) => {
                            e.preventDefault();
                            todosList.classList.add('drag-over');
                            e.dataTransfer.dropEffect = 'move';
                        });

                        todosList.addEventListener('dragleave', (e) => {
                            // Vérifier si on quitte vraiment la zone (pas un enfant)
                            if (!todosList.contains(e.relatedTarget)) {
                                todosList.classList.remove('drag-over');
                            }
                        });

                        todosList.addEventListener('drop', (e) => {
                            e.preventDefault();
                            todosList.classList.remove('drag-over');
                            
                            const taskId = e.dataTransfer.getData('text/plain');
                            const draggedElement = document.querySelector(`[data-task-id="${taskId}"]`);
                            
                            if (draggedElement && taskId) {
                                // Ajouter animation de feedback
                                draggedElement.classList.add('drop-feedback');
                                
                                // Changer le statut dans la base de données
                                changeTaskStatus(parseInt(taskId), statut);
                                
                                // Retirer l'animation après un délai
                                setTimeout(() => {
                                    draggedElement.classList.remove('drop-feedback');
                                }, 600);
                            }
                        });
                    });
                }

                // Initialiser les zones de drop
                setupDropZones();

                setupDragAndDrop(todoElement, tache.id);
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
