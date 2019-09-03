---
home: true
heroImage: /ontop-logo.png
title: 'Ontop'
description: 'A Virtual Knowledge Graph Engine'
actionText: Get Started →
actionLink: /guide/
footer: Documentation under CC-BY license | Copyright 2009-present - Free University of Bozen-Bolzano
---

### Versions

This documentation is for Ontop 4.0 and more recent versions.
Note that is still UNDER CONSTRUCTION.

For earlier versions, please visit [our previous Wiki](https://github.com/ontop/ontop/wiki)


### Editing the documentation
The source code of the documentation is on [Github](https://github.com/ontop/ontop-docs-src) and is powered by [VuePress](https://vuepress.vuejs.org/).

To test it on your local machine:

``` bash
# install
yarn global add vuepress # OR npm install -g vuepress

git clone git@github.com:ontop/ontop-docs-src.git
cd ontop-docs-src

# start the local server
yarn docs:dev

# commit your changes and push them back to Github
```

VuePress requires Node.js >= 8.

Once pushed on Github, this public documentation is automatically rebuilt by Travis CI.

