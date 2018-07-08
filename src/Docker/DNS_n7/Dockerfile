FROM debian:stretch-slim
RUN apt-get update
RUN apt-get -y install iptables apt-utils iproute2 net-tools systemd telnet nano iputils-ping tcpdump inetutils-traceroute bind9
RUN apt-get -f install
RUN mkdir /etc/scripts
ENV PATH "/etc/scripts:$PATH"
RUN mkdir /var/log/bind9
RUN chown bind:bind /var/log/bind9
ENTRYPOINT /etc/init.d/bind9 start && /bin/bash
