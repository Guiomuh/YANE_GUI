FROM debian:jessie-slim
RUN apt-get update
RUN apt-get -y install apt-utils iptables iproute2 net-tools systemd telnet nano iputils-ping tcpdump inetutils-traceroute apache2
RUN apt-get -f install
RUN mkdir /var/scripts
ENV PATH "/var/scripts:$PATH"
ENTRYPOINT /etc/init.d/apache2 start && /bin/bash
