#!/usr/bin/env bash
set -eEuo pipefail

cd `dirname $BASH_SOURCE`/..

NODE_ENV=production \
  forever start \
  -m 1 \
  -l /opt/laserchess/out.log \
  -e /opt/laserchess/error.log \
  -p /opt/laserchess \
  -a \
  -c "yarn server" \
  --uid laserchess \
  --sourceDir /opt/laserchess \
  --workingDir /opt/laserchess \
  -t \
  ./
