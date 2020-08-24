#!/usr/bin/env bash
set -eEuo pipefail

cd `dirname $BASH_SOURCE`/..
git pull
yarn
bin/restart.sh

