#!/bin/bash

# Make sure we are in the script directory
ScriptDIR=$(cd `dirname $0` && pwd)
if [ $ScriptDIR != $PWD ]; then
   echo "Ce script doit être executé depuis son dossier" 1>&2
   exit
fi

#Install Docker
sudo apt-get install apt-transport-https dirmngr
sudo echo 'deb https://apt.dockerproject.org/repo debian-stretch main' >> /etc/apt/sources.list
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys F76221572C52609D
sudo apt-get update
sudo apt-get install docker-engine

# Softwares
sudo apt-get install dnsutils telnet traceroute wireshark jq xterm chromium filezilla

# Edit PATH pour utiliser dhclient + Script Wireshark
PATH=/home/n7/Scripts:$PATH:/sbin

#build docker images
sudo docker build -t apache_n7 ./Docker/apache_n7/
sudo docker build -t dhcp_n7 ./Docker/DHCP_n7/
sudo docker build -t ftp_n7 ./Docker/FTP_n7/
sudo docker build -t quagga_n7 ./Docker/quagga_n7/
sudo docker build -t dns_n7 ./Docker/DNS_n7/
sudo docker images
