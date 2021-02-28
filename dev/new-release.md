# Make a new release

### Update documents

- `README.html` in `client/protege`. This file will be displayed in the Protégé Plugin Update window.
- `README.md` in `build/distribution`. This file will be uploaded to SourceForge
- `update.properties` file in `client/protege`. This is the configuration file for Protégé plugin Auto Update

###  Create a git branch for release

```console
$ git checkout develop
$ git checkout -b release/v-number
```
### Update the version numbers

Update pom.xml files by Maven plugin to a SNAPSHOT version:


```console
$ ./mvnw versions:set -DnewVersion=4.0.0-SNAPSHOT 
```


### Build maven packages

```
$ ./mvnw release:clean

# Preparing the release will create the new tag in git and automatically push to github
# When 100% sure, you can skip the test by `-Darguments="-DskipTests"`
$ ./mvnw -DperformRelease=true release:prepare

# stage the release
$ ./mvnw release:perform 

# Or stage from a Git tag
# ./mvnw release:perform  -DconnectionUrl=scm:git:git@github.com:ontop/ontop.git -Dtag=ontop-3.0.0
```

### Build Ontop bundles

* [Build Instruction](/dev/build)

```console
$ ./build-release.sh 
```

### Test
* run protege plugin tests
* test CLI

### Release

* Deploy the packages to SourceForge via sftp.

```console
$ sftp user,ontop4obda@frs.sourceforge.net
$ cd /home/pfs/project/o/on/ontop4obda
# sftp://ghxiao,ontop4obda@frs.sourceforge.net/home/pfs/project/o/on/ontop4obda
``` 

* Stage the artifacts in sonatype [https://oss.sonatype.org](https://oss.sonatype.org)

* Update [the guide homepage](/guide) and [the release notes](/guide/releases) of this website

* Update <https://github.com/ontop/ontop-api-examples>

* Send release emails to several mail lists

### Prepare for next development iteration

Update branches:

Merge the tag for the release to master and the release branch to develop

```console
$ git checkout master
$ git merge v-number # tag

$ git checkout develop
$ git merge release/v-number #branch 
```

### Time for celebration!
