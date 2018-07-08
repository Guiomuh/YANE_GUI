FROM debian:stretch-slim
RUN apt-get update
RUN yes | apt-get -y install iptables apt-utils iproute2 net-tools systemd telnet nano iputils-ping tcpdump inetutils-traceroute isc-dhcp-server
RUN apt-get -f install
RUN mkdir /etc/scripts
ENV PATH "/etc/scripts:$PATH"
ENTRYPOINT /bin/bash
