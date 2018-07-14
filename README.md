# YANE_GUI

Cette application web propose une interface graphique pour l’outil d’émulation réseau [YANE](https://github.com/Manu-31/yane) en proposant des applications (serveur DNS, serveur WEB, serveur DHCP, serveur FTP, émulateur routeur Cisco) supplémentaires contenues dans des images Docker.


## 1) Installation :
Ce projet nécessite quelques dépendances pour être fonctionnel (cf. Section 8).
<br/>Pour les installer lancez la commande suivante :
```
sh 00-Install.sh
```
L’installation qui peut prendre plusieurs minutes va commencer.
<br/>(Installation des programmes + Création des images docker à partir des Dockerfiles)



## 2) Création d’un projet :
La création d’un projet se réalise en 2 temps :

### Etape 1 
Dans un premier temps on génère graphiquement une architecture à l’aide de l’outil de création (01-Create.html). On peut ici glisser pour déposer les différents éléments que l’on souhaite retrouver dans notre réseau, leur attribuer un nom réseau, un nombre d’interfaces et les relier entre elles.
<br/>Une fois notre architecture terminée on peut cliquer sur le bouton en bas à droite « Télécharger l’Architecture ». 
<br/>Un fichier JSON est alors téléchargé.

![Alt text](images_doc/Ex1.png?raw=true "Title")

### Etape 2
La seconde étape consiste à générer le projet en disposant d’une architecture précédemment créée avec l’interface graphique (fichier JSON). Pour cela il suffit d’exécuter le script 02-Build  avec la commande suivante :
```
./02-Build <PATH TO JSON>
```
Ce script va créer un nouveau projet dans le dossier ./Projets (Nous allons voir par la suite comment utiliser un tel projet).


### Remarque :
Ces deux étapes pourraient être réunies en une seule, cependant il faudra utiliser un serveur pour l'application web (PHP par exemple). En effet on ne peut pas générer des dossiers coté client en JavaScript. Etant donné que l’on ne dispose pas d’un serveur pour réaliser cela, la partie génération de dossier est (pour le moment) traitée par le script 02-Build.




## 3) Utilisation d’un Projet avec YANE :
Une fois crées, les projets se trouvent dans le dossier "./Projets". Un projet est un dossier contenant YANE et des scripts permettant son bon fonctionnement et ajoutant d’autres fonctionnalités comme l’utilisation de wireshark sur n’importe quel élément du réseau virtuel.

Un projet dispose de 2 scripts de gestion START et STOP pour lancer et arrêter le projet.
<br/>Un projet dispose de 2 types de machines émulées, des dockers et des namespaces. Chaque machine émulée dispose d’un script qui lui est associé (présent dans le dossier scripts du projet correspondant) et de fichiers « partagés » (présents dans le dossier files du projet correspondant).





### Fichiers partagés : 
Dans le dossier files du projet on retrouve des dossiers correspondants aux éléments réseaux (docker) de notre architecture (exemple : serveur web, dns, dhcp..). A chaque démarrage de projet ces fichiers remplacent les fichiers présents dans le container Docker.
Ce système permet ainsi de sauvegarder les modifications des fichiers de configuration.

Chaque image Docker dispose de fichiers par défaut qui sont copiés dans leur dossier partagé lors de la création d’un Projet (Phase de Build). On peut retrouver et modifier ces fichiers par défaut dans le dossier ./ModelFiles/files/ on retrouve dans ce dossier les noms des différentes images Docker disponibles (cf partie 7). Ainsi on retrouve par défaut les fichiers suivants :

- Pour le Docker DHCP : Configuration par défaut de dhcpd
- Pour le Docker DNS : Configuration complète d’exemple (fonctionne pour l’exemple de projet fonctionnel)
- Pour le Docker FTP: Configuration complète d’exemple (fonctionne pour l’exemple de projet fonctionnel)
- Pour le Docker Routeur: Configuration par défaut de ripd
- Pour le Docker WEB: Site WEB d’exemple


### Scripts :
Pour sauvegarder l’avancement de la configuration des différents éléments virtuels (par exemple configuration IP, routes, IPTABLES.. etc) un système de script a été mis en place. Dans un Projet chaque élément dispose d’un script du même nom qui lui est associé dans le dossier scripts. 
Pour ce qui est des Namespace ces scripts sont exécutés automatiquement au démarrage (fonctionnalité de YANE).
Pour ce qui est des Dockers il suffit d’exécuter la commande suivante dans la console xterm de l’élément virtuel pour exécuter le script correspondant :
```
init
```


(Lors du démarrage du projet avec le script START les scripts associés à chaque Docker sont copiés dans le dossier « /etc/scripts » présent dans leur dossier de fichiers partagés respectif, emplacement qui a été préalablement ajouté au PATH du container Docker) 

Ainsi de cette façon on peut sauvegarder notre avancement dans la configuration en écrivant nos commandes dans les scripts et en modifiants les fichiers de configurations des services dans les fichiers partagés.



### Wireshark :
Dans chaque projet on trouve un script nommé "wireshark" qui permet d’exécuter wireshark sur les différents éléments virtuel du réseau. Pour l’utiliser il suffit de connaître le nom donné à l’élément que l’on veut observer dans wireshark et d’utiliser la commande suivante :  
```
sudo ./wireshark <NOM>
```

Par exemple si on veut observer le trafic sur le serveur DHCP nommé « DHCP_1 » il suffit d’exécuter la commande suivante depuis le dossier du projet correspondant :
```
sudo ./wireshark DHCP_1
```
Wireshark s’ouvre alors et on peut ensuite sélectionner les interfaces de la machine DHCP_1




## 4) Description des fichiers/dossiers de YANE_GUI :

![Alt text](images_doc/Archi1.png?raw=true "Title")

- 00-Install.sh : Script d’installation des dépendances
- 01-Create.html : Racourcis pour lancer l’interface graphique de création d’architecture
- 02-Build : Script permettant de créer un projet à partir d’une architecture (fichier JSON)
- Architectures JSON : Dossier contenant des architectures JSON d’exemples (déjà crées par l’interface)
- Docker : Dossier contenant les fichiers de création des images Docker (images crées lors de l’installation)
- ModelFiles : Fichiers modèles utilisés lors de la création d’un projet (par Build)
- Projets : Dossier contenant les projets précedement créés
- WebFiles : Dossier contenant les fichiers de l’interface graphique (WEB)




## 5) Description des fichiers/dossiers d’un Projet :

![Alt text](images_doc/Archi2.png?raw=true "Title")

- files : Dossier contenant les fichiers partagés avec les containers dockers
- scripts : Dossier contenant les scripts d’initialisation
- START : Script de lancement du projet
- STOP : Script d’arrêt du projet
- wireshark : Script de lancement de wireshark sur un élément virtuel

Fichiers et dossiers de configuration de YANE :
- yane             
- yane.yml
- yane-config.yml
- yane.yml.sessions
- modules      




## 6) Machine Virtuelle:
Une machine virtuelle (hyperviseur Vmware Workstation 14) est disponible au téléchargement avec tout d’installé à l’adresse suivante :  
```
En cour d'upload..
```

Logins :
```
user : root
password : root
```

```
user : n7
password : n7
```


## 7) Images Dockers :
- apache_n7:latest → Server WEB (Apache2), les fichiers du site sont dans le dossier /var/www/html/
- dns_n7:latest → Server DNS (Bind9)
- dhcp_n7:latest → Server DHCP (isc-dhcp-server)
- ftp_n7:latest → Server FTP (proftpd)
- quagga_n7:latest → Routage dynamique (ripd, zebra.. etc)


Pour configurer le routage dynamique avec ripd:
```
telnet localhost ripd
(mot de passe : zebra)
en
conf t
router rip
network 17.0.0.0/24 (pour ajouter un réseau)
```



## 8) Programmes installés lors de l’installation :
- docker-engine
- dnsutils
- telnet
- traceroute
- wireshark
- jq (Parser JSON en ligne de commande)
- xterm (Nécessaire pour YANE)
- chromium (Navigateur web pour visualiser au mieux l’utilitaire de création (animations en webkit))
- filezilla (Client ftp pour visualiser le fonctionnement du serveur ftp)




## 9) Améliorations à réaliser :

- [ ] Empêcher l’utilisateur de donner des noms réseaux avec des espaces dans l’interface graphique, ou remplacement des caractères (bug avec YANE)

- [ ] Gestion des espaces dans le chemin donné en argument du script Build

- [ ] Prendre en charge le cas où un projet du même nom existe déjà (dans le script Build)

- [ ] Empecher de relier 2 switchs entre eux dans l'interface web ou prendre en charge le cas dans le script Build (en bridgant les inerfaces)



## 10) Exemple de Projet : ProjetFini

Un projet complètement configuré (scripts et fichiers partagés) est déjà présent dans le dossier Projets sous le nom « ProjetFini ».
(Voir figure ci-dessous pour l’architecture et l’adressage)

![Alt text](images_doc/ProjetFini.png?raw=true "Title")

Pour tester la configuration on peut utiliser les commandes suivantes depuis la console xterm de Client1 :

Test routage :
```
traceroute 12.0.0.2
```

Test web :
```
firefox 10.0.0.2
```

Test DNS :
```
firefox www.monsupersite.com

host www.monsupersite.com
```

Test FTP :
```
filezilla
```
Puis rentrer les informations suivantes :
<br/>host: 11.0.0.2
<br/>user: ftpusr
<br/>pass: ftpusr

Pour visualiser les paquets passants par le routeur RRI on peut exécuter la commande suivante dans le dossier du projet :

```
./wireshark RRI
```