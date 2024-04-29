# Git workflow

In the development of Ontop project, we follow the `git-workflow`: [http://nvie.com/posts/a-successful-git-branching-model/](http://nvie.com/posts/a-successful-git-branching-model/)

A few points:
* Main development branch: `versionX`. Every commit in this branch is expected to be shipped with the next X.Y.Z release.
* Names of the branches:
  * feature branches: `feature/featurename`
  * bug fix branches: `bugfix/bugname`. 
    * If there a corresponding GitHub page, use name `bugfix/bugname-issue-number` or `bugfix/issue-number`
  * Maintenance branches for releases: `releasing/vX.Y` (e.g. `releasing/v5.0`)

* Use `--no-ff` option for merging, especially for merging the feature or bugfix branches to `versionX`

> The --no-ff flag causes the merge to always create a new commit object, even if the merge could be performed with a fast-forward. This avoids losing information about the historical existence of a feature branch and groups together all commits that together added the feature. 
