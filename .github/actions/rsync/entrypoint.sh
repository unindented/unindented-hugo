#!/bin/sh -l

set -o errexit
set -o pipefail
set -o nounset

SSH_PATH="${HOME}/.ssh"

mkdir -p "${SSH_PATH}"

if [ -z "${SSH_PRIVATE_KEY}" ];
then
  echo ::set-output name=status::'Action did not find the SSH_PRIVATE_KEY secret.'
  exit 1
else
  printf '%b\n' "${SSH_PRIVATE_KEY}" > "${SSH_PATH}/key"
fi

chmod 700 "${SSH_PATH}"
chmod 600 "${SSH_PATH}/key"

sh -c "rsync ${INPUT_OPTIONS} -e 'ssh -i ${SSH_PATH}/key' '${GITHUB_WORKSPACE}/${INPUT_SOURCE}' '${SSH_USERNAME}@${SSH_HOSTNAME}:${INPUT_TARGET}'"
