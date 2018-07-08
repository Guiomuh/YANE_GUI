FROM debian:stretch-slim
RUN apt-get update
RUN apt-get -y install iptables apt-utils iproute2 net-tools systemd telnet nano iputils-ping tcpdump inetutils-traceroute proftpd
RUN apt-get -f install
RUN mkdir /etc/scripts
ENV PATH "/etc/scripts:$PATH"
ENTRYPOINT /bin/bash

