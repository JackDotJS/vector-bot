#!/usr/bin/env bash

# Stop at command failures. Why this isn't default, I will never know.
set -e

# https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork#syncing-a-fork-from-the-command-line
git fetch upstream;
git checkout ts-dev;
git merge upstream/dev;
