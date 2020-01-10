# Git workflow

In the development of Ontop project, we follow the following git-workflow: [http://nvie.com/posts/a-successful-git-branching-model/](http://nvie.com/posts/a-successful-git-branching-model/)

A few points:

* Names of the branches:
  * feature branches: `feature/featurename`
  * bug fix branches: `bugfix/bugname`. 
    * If there a corresponding GitHub page, use name `bugfix/bugname-issue-number` or `bugfix/issue-number`

* Use `--no-ff` option for merging, especially for merging the the feature or bugfix branches to develop

> The --no-ff flag causes the merge to always create a new commit object, even if the merge could be performed with a fast-forward. This avoids losing information about the historical existence of a feature branch and groups together all commits that together added the feature. 