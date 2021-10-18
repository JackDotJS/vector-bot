#!/usr/bin/env bash

# Stop at command failures. Why this isn't default, I will never know.
set -e

git checkout dev
git pull upstream dev
git commit -m "Merge upstream changes"
git checkout -