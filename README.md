# to-do list 🌷

### EN Burn-Out ? ma todo-list est faite pour vous ✨

Cette todo-list est sectionnée en 3 parties :

- *Urgent*
- *Important*
- *Après*

***Pourquoi !?* Bah parce que chaque chose a son temps et au lieu de vous surmener, vous pourriez accomplir vos taches de manière progressive des *plus urgente* a celles qui les sont moins 😉**

<p align="center">
  <img src="assets/todo.png" alt="Aperçu" style="max-width: 100%; height: auto;">
</p>


## Comment l'utiliser !?

### Dependences

- PHP
- MySQL
- **XAMPP** ou **WAMPP** (ou simplement Apache)

#### 1. Cloner mon repo GitHub 😗

```zsh
git clone https://github.com/lolorine16/Todo-list-php
```

#### 2. MySQL 🗄️✨

```zsh
sudo mysql -u root -p #(ou ton username) puis saisi ton mdp
```

#### 3. Créer votre base de donnée 👇

```mysql
CREATE DATABASE todo_db;
USE todo_db;
```

#### 4. Créer la table SQL dans la base de donnée 🗄️

```mysql
CREATE TABLE taches(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contenu TEXT,
    statut ENUM('urgent','important','apres') DEFAULT 'apres'
);
```

*OU*

```zsh
cd Todo-list-php  #ensuite lancer MySQL
```
```mysql
SOURCE taches.sql
```

#### 5. Dernière modification 😆✨✨

Modifie le fichier db.php :

```zsh
cd Todo-list-php/php/

nano db.php
```

***check et c'est partie*** 🥰❤️✨

#### 6. Pour finir ❤️✨

```zsh
php -S localhost:8003
```
  
*Quand tout est bon ✨* **tape dans ton navigateur 👉**

```txt
http://localhost:8003/index.html
```

# Les Choses a améliorer

- [ ] Modifier le statut des taches avec la fonctionnalité **Drag**

- [ ] Modifier les statut de certaines taches **immédiatement avec AJAX**