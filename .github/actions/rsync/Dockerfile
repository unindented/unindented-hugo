FROM alpine:latest@sha256:21dc6063fd678b478f57c0e13f47560d0ea4eeba26dfc947b2a4f81f686b9f45

RUN apk update

RUN apk add rsync openssh-client && \
  echo "StrictHostKeyChecking no" >> /etc/ssh/ssh_config

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
