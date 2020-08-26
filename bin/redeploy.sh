#!/usr/bin/env bash
set -eEuo pipefail

cd `dirname $BASH_SOURCE`/..
git fetch origin
git reset --hard origin/master
yarn
bin/restart.sh

