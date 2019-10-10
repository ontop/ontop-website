# Documentation

The source code of the documentation is on [Github](https://github.com/ontop/ontop-website) and is powered by [VuePress](https://v1.vuepress.vuejs.org/).

Once a commit is pushed to the Github repository, this public documentation is automatically rebuilt by Travis CI.

## Small improvements

Have you found a typo, a broken URL or another small problem? Please propose a fix immediately (before forgetting it), by clicking on the link `Edit this page` at the bottom of the page. 

## Testing the documentation locally

For a more involved work on the documentation, we recommend you to test your changes on your local machine before pushing them to Github.

``` bash
git clone git@github.com:ontop/ontop-website.git
cd ontop-website

# Install the dependencies (e.g. vuepress)
yarn install

# start the local server
yarn docs:dev

# commit your changes and push them back to Github
```

[VuePress](https://v1.vuepress.vuejs.org/) requires Node.js >= 8.6.
