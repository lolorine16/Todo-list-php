document.addEventListener('DOMContentLoaded', function () {
    const addBtn = document.querySelector('.add-btn');
    const taskNameInput = document.getElementById('taskName');
    const statusRadios = document.querySelectorAll('input[name="status"]');

    addBtn.addEventListener('click', function () {
        const taskName = taskNameInput.value.trim();
        const selectedStatus = Array.from(statusRadios).find(radio => radio.checked);

        if (!taskName || !selectedStatus) {
            alert("Veuillez entrer un nom de tâche et choisir un statut.");
            return;
        }

        const statut = selectedStatus.value;

        fetch('http://localhost:8003/php/add.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contenu: taskName, statut: statut })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Tâche ajoutée avec succès !");
                // Redirection vers la page d'accueil
                window.location.href = '/index.html';
            } else {
                alert("Erreur lors de l'ajout : " + (data.error || "inconnue"));
            }
        })
        .catch(err => {
            alert("Une erreur est survenue : " + err.message);
        });
    });
});
