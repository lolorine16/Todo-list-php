
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('importForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // je ne veux plus que ca reload

        const formData = new FormData(form);

        fetch('http://localhost:8003/php/import.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Tâches importées avec succès !");
                
                //  reloadTaches(); ou un petit message T-T
            } else {
                alert("Erreur : " + data.error);
            }
        })
        .catch(err => {
            alert("Une erreur est survenue : " + err.message);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeBtn');

    closeBtn.addEventListener('click', function (e) {
        e.preventDefault(); // Juste au cas ou
        window.location.href = '/index.html'; // Redirection manuelle vers index.html
    });
});
