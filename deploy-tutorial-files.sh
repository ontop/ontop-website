#!/bin/bash

cd .vuepress/public/tutorial
#cp -R ../../../tutorial/ .
git init
git add *
git commit -m "Tutorial files extracted"
git remote add origin https://ontop-travis:${GITHUB_TOKEN}@github.com/ontop/ontop-tutorial.git
git push -f origin master
rm -rf .git
