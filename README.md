# YANE_GUI

Cette application web propose une interface graphique pour l’outil d’émulation réseau YANE en proposant des différentes applications (serveur DNS, serveur web, émulateur routeur Cisco) supplémentaires contenues dans des images Docker. 


## 1) Installation :
Ce projet nécessite quelques dépendances pour être fonctionnel (cf. Section 8). Pour les installer lancez la commande suivante :   sh 00-Install.sh
L’installation qui peut prendre plusieurs minutes va commencer. (installation des programmes + création des images docker à partir des Dockerfiles)



## 2) Création d’un projet:
La création d’un projet se réalise en 2 temps :

### Etape 1 
 Dans un premier temps on génère graphiquement une architecture à l’aide de l’outil de création (01-Create.html). On peut ici glisser pour déposer les différents éléments que l’on souhaite retrouver dans notre réseau, leur attribuer un nom réseau, un nombre d’interfaces et les relier entre elles. Une fois notre architecture terminée on peut cliquer sur le boutons en bas à droite « Télécharger l’Architecture ». Un fichier JSON est alors téléchargé.


### Etape 2
La seconde étape consiste à générer le projet en disposant d’une architecture précédemment créée avec l’interface graphique (fichier JSON). Pour cela il suffit d’exécuter le script 02-Build  avec la commande suivante :
```
./02-Build <PATH TO JSON>
```
Ce script va créer un nouveau projet dans le dossier ./Projets nous allons voir par la suite comment utiliser un tel projet.

![Alt text](images_doc/Ex1.png?raw=true "Title")

### Remarque : ces deux étapes pourraient être réunies en une seule, cependant il faut utiliser une application web du côté du serveur  (on ne peut pas générer des dossiers coté client en javascript).  Etant donné que l’on doit disposer d’un serveur pour réaliser cela, la partie génération de dossier est (pour le moment) traitée par le script 02-Build




## 3) Utilisation d’un Projet avec YANE :
Une fois crées, les projets se trouvent dans le dossier ./Projets. Un projet est un dossier contenant YANE et des scripts permettant sont bon fonctionnement et ajoutant d’autres fonctionnalités comme l’utilisation de wireshark sur n’importe quel  élément du réseau virtuel.

Un projet dispose de 2 scripts de gestion START et STOP  pour lancer et arrêter le projet.
Un projet dispose de 2 types de machines émulées, des dockers et des namespaces. Chaque machine émulée dispose d’un script qui lui est associé (présent dans le dossier scripts du projet correspondant) et de fichiers « partagés » (présents dans le dossier files du projet correspondant).





### Fichiers partagés : 
Dans le dossier files du projet on retrouve des dossiers correspondants aux éléments réseaux (docker) de notre architecture (exemple : serveur web, dns, dhcp..). A chaque démarrage de projet ces fichiers remplacent les fichiers présents dans le container docker.
Ce système permet ainsi de sauvegarder les modifications des fichiers de configurations.

Chaque image docker dispose de fichiers par défaut qui sont copiés dans leur dossier partagé lors de la création d’un Projet (Phase de Build). On peut retrouver et modifier ces fichiers par défaut dans le dossier ./ModelFiles/files/ on retrouve dans ce dossier les noms des différentes images docker disponibles. Ainsi on retrouve par défaut les fichiers suivants :

Pour le Docker DHCP : configuration par défaut de dhcpd
Pour le Docker DNS : Configuration complète d’exemple (fonctionne pour l’exemple de projet fonctionnel)
Pour le Docker FTP: Configuration complète d’exemple (fonctionne pour l’exemple de projet fonctionnel)
Pour le Docker Routeur: configuration par défaut de ripd
Pour le Docker WEB: site d’exemple


### Scripts : Pour sauvegarder l’avancement de la configuration des différents éléments virtuels (par exemple configuration IP, routes, IPTABLES.. etc) un système de script a été mis en place. Dans un Projet chaque élément dispose d’un script du même nom qui lui est associé dans le dossier scripts. 
Pour ce qui est des Namespace ces scripts sont exécutés automatiquement au démarrage (fonctionnalité de YANE).
Pour ce qui est des Dockers il suffit d’exécuter la commande : init dans la console xterm de l’élément virtuel pour exécuter ce script. 
(Lors du démarrage du projet avec le script START les scripts associés à chaque docker sont copiés dans le dossier « /etc/scripts » présent dans leur dossier de fichiers partagés respectif, emplacement qui a été préalablement ajouté au PATH du container Docker) 

Ainsi de cette façon on peut sauvegarder notre avancement dans la configuration en écrivant nos commandes dans les scripts et en modifiants les fichiers de configurations des services dans les fichiers partagés.



### Wireshark :
Dans chaque projet on trouve un script wireshark qui permet d’exécuter wireshark sur les différents éléments virtuel du réseau. Pour l’utiliser il suffit de connaître le nom donné à l’élément que l’on veut observer dans wireshark et d’utiliser la commande suivante :  
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

00-Install.sh : Script d’installation des dépendances
01-Create.html : Racourcis pour lancer l’interface grafique de création d’architecture
02-Build : Script permettant de créer un projet à partir d’une architecture (fichier JSON)
Architectures JSON : Dossier contennat des architectures JSON d’exemples (déjà crées par l’interface)
Docker : Dossier contennat les fichiers de création des images Docker (images crées lors de l’installation)
ModelFiles : Fichiers modèles utilisés lors de la création d’un projet (par Build)
Projets : Dossier contenant les Projets précedement crées
WebFiles : Dossier contenant les fichiers de l’interface graphique (WEB)




## 5) Description des fichiers/dossiers d’un Projet :

![Alt text](images_doc/Archi2.png?raw=true "Title")

files : Dossier contenant les fichiers partagés avec les containers dockers
scripts : Dossier contenant les scripts d’initialisation
START : Script de lancement du projet
STOP : Script d’arrêt du projet
wireshark : Script de lancement de wireshark sur un élément virtuel

Fichiers et dossiers de configuration de YANE :
yane             
yane.yml
yane-config.yml
yane.yml.sessions
modules      




## 6) Machine Virtuelle:
Une machine virtuelle (hyperviseur Vmware Workstation 14) est disponible au téléchargement avec tout d’installé à l’adresse suivante :

Logins :
user : root
password : root

user : n7
password : n7



## 7) Images Dockers :
apache_n7:latest → server web (Apache2) Les fichiers du site sont dans le dossier /var/www/html/
dns_n7:latest
dhcp_n7:latest
quagga_n7:latest → routage dynamique (ripd, zebra.. etc)


Pour configurer le routage dynamique avec ripd:
```
telnet localhost ripd
(mot de passe : zebra)
en
conf t
router rip
network 17.0.0.0/24 (pour ajouter un réseau)
```



## 8) Programmes installées lors de l’installation :
docker-engine
dnsutils
telnet
traceroute
wireshark
jq (parser JSON en ligne de commande)
xterm (nécessaire pour YANE)
chromium (navigateur web pour visualiser au mieux l’utilitaire de création (animations en webkit)) filezilla (client ftp pour visualiser le fonctionnement du serveur ftp)




## 9) Améliorations :

- [ ] Empêcher l’utilisateur de donner des noms réseaux avec des espaces dans l’interface graphique (bug avec YANE)

- [ ] Gestion des espaces dans le chemin donné en argument du fichier build




## 10) Exemple de Projet : ProjetFini

Un projet complètement configuré (scripts et fichiers partagés) est déjà présent dans le dossier Projets sous le nom « ProjetFini ».
(Voir figure ci-dessous pour l’architecture et l’adressage)

![Alt text](images_doc/ProjetFini.png?raw=true "Title")

Pour tester la configuration on peut utiliser les commandes suivantes depuis la console xterm de Client1 :

Test routage :
```traceroute 12.0.0.2```

Test web :
```firefox 10.0.0.2```

Test DNS :
```firefox www.monsupersite.com
host www.monsupersite.com```

Test FTP :
```filezilla```  ( puis rentrer les infos suivantes host: 11.0.0.2   user: ftpusr   pass: ftpusr)

Pour visualiser les paquets passants par le routeur RRI on peut exécuter la commande suivante dans le dossier du projet :

```./wireshark RRI```