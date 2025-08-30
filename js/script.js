document.addEventListener('DOMContentLoaded', () => {
    const todoInputs = document.querySelectorAll('.todo-input');
    const dateInputs = document.querySelectorAll('.date-input');
    const todosLists = document.querySelectorAll('.todos-list');
    const searchInput = document.getElementById('searchInput');
    const statutMap = ['urgent', 'important', 'apres'];

    // Fonction qui sert à ajouter une tâche
    function addTodo(text, columnIndex, dueDate = null) {
        const statut = statutMap[columnIndex];

        const payload = { 
            contenu: text, 
            statut: statut 
        };
        
        if (dueDate) {
            payload.date_echeance = dueDate;
        }

        fetch('http://localhost:8003/php/add.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
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

    // Modifier une tâche avec modal
    function editTodo(id, oldText, oldDate = null) {
        // Créer l'overlay
        const overlay = document.createElement('div');
        overlay.className = 'edit-modal-overlay';
        
        // Créer le modal
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        
        // Input pour le texte
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = oldText;
        textInput.placeholder = 'Contenu de la tâche';
        
        // Input pour la date
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = oldDate || '';
        dateInput.placeholder = 'Date d\'échéance';
        
        // Boutons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'edit-modal-buttons';
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Sauvegarder';
        saveBtn.className = 'save-btn';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Annuler';
        cancelBtn.className = 'cancel-btn';
        
        buttonsDiv.appendChild(saveBtn);
        buttonsDiv.appendChild(cancelBtn);
        
        modal.appendChild(textInput);
        modal.appendChild(dateInput);
        modal.appendChild(buttonsDiv);
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        textInput.focus();

        const save = () => {
            const newText = textInput.value.trim();
            const newDate = dateInput.value;
            
            if (!newText) {
                closeModal();
                return;
            }

            const payload = { 
                id, 
                contenu: newText,
                date_echeance: newDate || null
            };

            fetch('http://localhost:8003/php/edit.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    loadTodos();
                } else {
                    alert("Erreur modification : " + data.error);
                }
                closeModal();
            });
        };

        const closeModal = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };

        saveBtn.addEventListener('click', save);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') save();
        });
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
                
                // Ajouter les classes CSS selon la date d'échéance
                const dateStatus = getDateStatus(tache.date_echeance);
                if (dateStatus) {
                    todoElement.classList.add(dateStatus);
                }

                const contentDiv = document.createElement('div');
                contentDiv.className = 'todo-content';

                const span = document.createElement('span');
                span.textContent = tache.contenu;
                contentDiv.appendChild(span);

                // Afficher la date d'échéance si elle existe
                if (tache.date_echeance) {
                    const dateDiv = document.createElement('div');
                    dateDiv.className = 'todo-date';
                    dateDiv.textContent = formatDate(tache.date_echeance);
                    
                    // Ajouter un badge si nécessaire
                    const badge = createDateBadge(tache.date_echeance);
                    if (badge) {
                        dateDiv.appendChild(document.createTextNode(' '));
                        dateDiv.appendChild(badge);
                    }
                    
                    contentDiv.appendChild(dateDiv);
                }

                // Badge pour la date d'échéance
                const dateBadge = createDateBadge(tache.date_echeance);
                if (dateBadge) {
                    todoElement.appendChild(dateBadge);
                }

                // Bouton modifier ~
                const editBtn = document.createElement('button');
                editBtn.textContent = '✎';
                editBtn.className = 'edit-btn';
                editBtn.onclick = () => {
                    editTodo(tache.id, tache.contenu, tache.date_echeance);
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

                todoElement.appendChild(contentDiv);
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

    // Ajouter une tâche avec Enter
    todoInputs.forEach((input, index) => {
        const dateInput = dateInputs[index];
        
        const addTask = () => {
            if (input.value.trim()) {
                const dueDate = dateInput.value || null;
                addTodo(input.value.trim(), index, dueDate);
                input.value = '';
                dateInput.value = '';
            }
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        dateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    });

    // Recharger a chaque frappe dans la recherche
    searchInput.addEventListener('input', loadTodos);

    loadTodos(); // Initialisation

    // ===== FONCTIONS UTILITAIRES POUR LES DATES =====

    function formatDate(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `En retard de ${Math.abs(diffDays)} jour(s)`;
        } else if (diffDays === 0) {
            return 'Aujourd\'hui';
        } else if (diffDays === 1) {
            return 'Demain';
        } else if (diffDays <= 7) {
            return `Dans ${diffDays} jours`;
        } else {
            return date.toLocaleDateString('fr-FR');
        }
    }

    function getDateStatus(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return 'overdue';
        } else if (diffDays === 0) {
            return 'due-today';
        } else if (diffDays <= 3) {
            return 'due-soon';
        }
        return null;
    }

    function createDateBadge(dateString) {
        const status = getDateStatus(dateString);
        if (!status) return null;

        const badge = document.createElement('span');
        badge.className = 'due-badge';
        
        switch (status) {
            case 'overdue':
                badge.className += ' overdue';
                badge.textContent = 'En retard';
                break;
            case 'due-today':
                badge.className += ' today';
                badge.textContent = 'Aujourd\'hui';
                break;
            case 'due-soon':
                badge.className += ' soon';
                badge.textContent = 'Bientôt';
                break;
        }
        
        return badge;
    }
});
