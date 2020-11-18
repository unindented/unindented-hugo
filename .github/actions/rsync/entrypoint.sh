#!/bin/sh -l

set -o errexit
set -o pipefail
set -o nounset

SSH_PATH="${HOME}/.ssh"

mkdir -p "${SSH_PATH}"

if [ -z "${SSH_PRIVATE_KEY}" ];
then
  echo ::set-output name=status::'Could not find secret with SSH key.'
  exit 1
fi

printf '%b\n' "${SSH_PRIVATE_KEY}" > "${SSH_PATH}/key"

chmod 700 "${SSH_PATH}"
chmod 600 "${SSH_PATH}/key"

sh -c "rsync ${INPUT_OPTIONS} -e 'ssh -i ${SSH_PATH}/key' '${GITHUB_WORKSPACE}/${INPUT_SOURCE}' '${INPUT_TARGET}'"

status=$?

if [ ${status} -ne 0 ];
then
  echo "::set-output name=status::'There was an issue syncing the content.'"
  exit 1
else
  echo "::set-output name=status::'Content synced successfully.'"
fi
