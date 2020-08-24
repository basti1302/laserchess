#!/usr/bin/env bash
set -xeEuo pipefail

cd `dirname $BASH_SOURCE`/..

forever restart laserchess
