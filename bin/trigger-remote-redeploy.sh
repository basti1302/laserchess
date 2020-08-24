#!/usr/bin/env bash
set -eEuo pipefail

ssh laserchess@digital-ocean-fooosball /opt/laserchess/bin/redeploy.sh

echo Remote server has been redeployed and app has been restarted.

