# Qmax - Application de révision pour CPGE

Ce dépôt contient le code source de la nouvelle version de **Qmax**, une application mobile destinée aux étudiants en Classes Préparatoires aux Grandes Écoles (CPGE). L'objectif de Qmax est de proposer des QCMs de physique-chimie adaptés à la filière, au domaine, au chapitre et à la compétence ciblée par l'élève.

L’application est en cours de redéveloppement complet à partir d’une version existante, en utilisant **Ionic/Angular** pour le frontend et **Express/Node.js** pour le backend.

---

## 🗂 Structure du projet

```
Projet-S8/
├── backend/      # Serveur Express (API REST + SQL)
└── frontend/     # Application Ionic/Angular (mobile/web)
```

### 📱 Frontend (Ionic/Angular)

- Dossier : `frontend/`
- Démarrage sur : `http://127.0.0.1:8100`
- Configuration : `ionic.config.json`, `capacitor.config.ts`
- Code source principal : `src/`

### 🌐 Backend (Express/Node.js + SQL)

- Dossier : `backend/`
- Serveur Express lancé via `server.js` sur : `http://127.0.0.1:3000`
- Structure :
  - `scripts/` : définit les routes de l'API (chaque fichier appelle une méthode SQL)
  - `sql/` : 
    - `sqlConfig.js`, `sqlConnect.js` : connexion à la base de données
    - `sql*.js` : fichiers de requêtes SQL (ex : `sqlQuestions.js`, `sqlSkills.js`)
  - `util/message.js` : méthodes utilitaires pour répondre au frontend (`sendMessage`, `sendError`)
  - `data/` : éventuels fichiers de données statiques

---

## ⚙️ Installation

1. **Cloner le dépôt**

```bash
git clone https://github.com/Bectaly13/Projet-S8.git
cd Projet-S8
```

2. **Installer les dépendances**

Dans le **frontend** :

```bash
cd frontend
npm install
```

Dans le **backend** :

```bash
cd ../backend
npm install
```

---

## 🚀 Lancement de l'application

1. **Lancer le backend (API Express)**

Depuis le dossier `backend/` :

```bash
node server.js
```

Le backend sera disponible à l'adresse : [http://127.0.0.1:3000](http://127.0.0.1:3000)

2. **Lancer le frontend (Ionic)**

Depuis le dossier `frontend/` :

```bash
ionic serve
```

Le frontend sera accessible à l'adresse : [http://127.0.0.1:8100](http://127.0.0.1:8100)

---

## 🛠 Dépendances clés

### Backend

- Node.js / Express
- MySQL (via `mysql2` ou autre librairie de connexion)

### Frontend

- Ionic Framework
- Angular
- Capacitor

---

## 📌 Remarques

- Ce projet est encore en développement actif.
- La connexion à la base de données doit être correctement configurée dans `backend/sql/sqlConfig.js`.
- La communication entre frontend et backend repose sur des appels HTTP (REST API).
