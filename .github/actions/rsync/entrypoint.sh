#!/bin/sh -l

set -o errexit
set -o pipefail
set -o nounset

SSH_PATH="${HOME}/.ssh"

mkdir -p "${SSH_PATH}"

if [ -z "${SSH_PRIVATE_KEY}" ];
then
  echo "status='Could not find secret with SSH key.'" >> $GITHUB_OUTPUT
  exit 1
fi

printf '%b\n' "${SSH_PRIVATE_KEY}" > "${SSH_PATH}/key"

chmod 700 "${SSH_PATH}"
chmod 600 "${SSH_PATH}/key"

sh -c "rsync ${INPUT_OPTIONS} -e 'ssh -i ${SSH_PATH}/key' '${GITHUB_WORKSPACE}/${INPUT_SOURCE}' '${INPUT_TARGET}'"
status=$?

if [ ${status} -ne 0 ];
then
  echo "status='There was an issue syncing the content.'" >> $GITHUB_OUTPUT
  exit 1
else
  echo "status='Content synced successfully.'" >> $GITHUB_OUTPUT
fi
