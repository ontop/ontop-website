#!/bin/bash

cd .vuepress/public/tutorial
git init
git add *
git commit "Tutorial files extracted"
git remote add origin https://github.com/ontop/ontop-tutorial.git
git push -f origin master
rm -rf .git
