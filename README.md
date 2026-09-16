CMake CIEL — Révision interactive

Site web éducatif destiné aux étudiants de BTS CIEL option Informatique et Réseaux.

Contenu

Le site propose :

•
un cours sur CMake et les étapes de compilation ;

•
une introduction à la cross-compilation ;

•
les commandes de base de Git ;

•
les notions UML et POO en C++ ;

•
un quiz interactif sur ces notions et sur les commandes Linux de base ;

•
un système de score avec feedback immédiat.

Technologies utilisées

•
React

•
TypeScript

•
Vite

•
CSS

•
Tailwind CSS

Le site fonctionne sans backend ni base de données externe.

Installation

Bash


pnpm install



Lancer le projet en développement

Bash


pnpm dev



Le site sera disponible à l’adresse indiquée par Vite, généralement :

Plain Text


http://localhost:3000



Vérifier le projet

Bash


pnpm check
pnpm build



Structure principale

Plain Text


client/
  src/
    pages/Home.tsx   # Interface, cours et quiz
    index.css        # Styles du site
server/              # Serveur de production fourni par le projet



Licence

Projet éducatif réalisé pour la révision des notions vues en BTS CIEL IR.

