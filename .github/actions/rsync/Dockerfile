FROM alpine:latest@sha256:7eccd4d5d574a3c889b0a6d97b2cdd0308c8e1afc2bba8d467c2b87d879b0c1c

RUN apk update

RUN apk add rsync openssh-client && \
  echo "StrictHostKeyChecking no" >> /etc/ssh/ssh_config

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
