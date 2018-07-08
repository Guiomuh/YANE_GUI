# Image Quagga

### version : `1.0`

### image parente : `debian:jessie`

### packages :
* quagga
* net-tools
* iproute2
* nano
* telnet

### Fichiers de config fournis :
** Attention version de docker minimum :** `v17.09.0-ce`

```
/YANE/images/quagga/quagga/daemons
/YANE/images/quagga/quagga/debian.conf
/YANE/images/quagga/quagga/ospfd.conf
/YANE/images/quagga/quagga/zebra.conf
```

### Point d'entrée :
* Lancement de quagga : `/etc/init.d/quagga start`
* /bin/bash

### How to build ?
    # docker build --tag quagga:latest /YANE/images/quagga
