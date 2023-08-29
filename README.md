# AppMobile2_PFI
Projet Final d'Intégration du Programmation d'applications mobile2

/** 
* Fournier Allan & & Chen Enlong
* 28/08/2023
* -- PFI pour le cours de Jabour Lina --
*/

--    énoncé    -- 

Développement d’applications mobiles-2
420-160-LG
Enseignante
Lina Jabbour
Production finale d’intégration (35%)
Date début: lundi 28 août 2023
Remise : jeudi 21 septembre 2023
420-160 PFI Été 2023
2
Objectif : Dans une équipe de deux à trois élèves, créez le prototype avancé 
d’un commerce électronique avec React Native.
À Préparation
1- Mettez-vous dans une équipe de deux ou trois élèves.
2- Choisissez votre sujet de produits à vendre pour votre application.
B- Base de données : utilisez les tables suivantes.
Produit : id, nom, description, prix, image
Connexion : usager, mdp, admin (booléen)
C- Fonctionnalités
 Votre prototype avancé va tester la connexion à une base de données et exécuter des 
requêtes; il va être utilisé pour aussi montrer à votre client l’interface usager et la 
navigation, ainsi que la localisation (maps) des entrepôts. 
Vous êtes mandatés à intégrer les fonctionnalités suivantes dans votre prototype 
d’application mobile :
1. Un utilisateur peut ouvrir une session en se connectant. Si l’usager qui s’est 
connecté est un administrateur, il peut avoir accès à la page permettant l’ajout et 
la suppression de produits. Et si c’est un client, il peut voir la liste de produits,
cliquer sur un produit pour voir les détails : nom, description, prix et image; dans
la page détails, il peut ajouter le produit au panier.
2. Un panier montre la liste des produits sélectionnés avec leurs quantités, prix et 
prix total. Le client peut alors enlever un item, vider le panier, retourner à la liste 
de produits ou acheter. S’il achète, affichez un écran final d’achat.
3. Une page de localisation affiche des icônes entrepôts et un titre pour les quatre 
entrepôts du commerce en ligne. Aussi, affichez deux informations graphiques 
pour souligner le dépôt le plus proche de l’adresse de livraison. Comme le 
chemin et des cercles autour des entrepôts . (ici, utilisez un fichier JSON pour les 
coordonnées)
Bien sûr, vous avez besoin d’avoir les pages accueil et à-propos; dans cette dernière 
page, mettez vos noms. La page d’accueil peut contenir la connexion.
420-160 PFI Été 2023
3
D-Spécification additionnelle
1. L’interface de l’application doit être simple, claire et agréable à voir.
2. Pour naviguer, utilisez des icônes en bas de l’écran.
3. Le lien pour un administrateur apparaît seulement pour les administrateurs. Et 
les liens pour les produits, les détails et le panier apparaissent seulement pour 
une personne connectée en tant que client.
4. La connexion peut se faire à partir d’une liste de noms. Ajouter une authentification 
avec des champs d’entrées est considéré comme une fonctionnalité additionnelle.
5. Une fois connecté, le nom de l’usager apparaît sur chaque page dans le 
processus d’achat ou de gestion des produits.
6. Utilisez FlatList et Pressable (ou TouchableOpacity).
7. Votre code doit être reparti sur au moins deux fichiers .js
8. Utilisez l’internationalisation pour le texte, prix et date.
9. Ajoutez deux fonctionnalités additionnelles non vues dans le cours.
E-Travail d’équipe et votre note
Le projet devra être accompagné d’un document résumant la contribution de 
chacun des membres de l’équipe.
30% de la note du projet est la présentation du projet et la réponse aux questions. 
Vous êtes responsable de comprendre l’entièreté du travail. Vous devez être 
capable de m’expliquer, seul, l’ensemble du travail.
À la fin deu projet, vous m’envoyez une évaluation par les pairs et une autoévaluation.
Si l’enseignant le trouve nécessaire, il n’est pas tenu de donner la même note à 
chacun des membres de l’équipe