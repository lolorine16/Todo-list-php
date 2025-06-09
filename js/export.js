document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.querySelector('.export-btn');

    exportBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = 'http://localhost:8003/php/export.php';
        link.download = 'export.xml'; // nom du fichier telecharger
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
