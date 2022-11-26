# Make a new release

## Update documents

- `README.md` in `build/distribution`. This file will be uploaded to SourceForge and Github Releases
- `README.html` in `client/protege`. This file will be displayed in the Protégé Plugin Update window.
- `update.properties` file in `client/protege`. This is the configuration file for Protégé plugin Auto Update

## Create a git branch for release

```console
$ git checkout develop
$ git checkout -b release/v-number
```

## Update the version numbers

Update pom.xml files by Maven plugin to a SNAPSHOT version:

```console
$ ./mvnw versions:set -DnewVersion=4.0.0-SNAPSHOT
$ cd protge
$ ../mvnw versions:set -DnewVersion=4.0.0-SNAPSHOT
```

## Build Maven packages

```console
$ ./mvnw release:clean

# Preparing the release will create the new tag in git and automatically push to github
# When 100% sure, you can skip the test by `-Darguments="-DskipTests"`
$ ./mvnw -DperformRelease=true release:prepare

# stage the release
$ ./mvnw release:perform 

# Or stage from a Git tag
# ./mvnw release:perform  -DconnectionUrl=scm:git:git@github.com:ontop/ontop.git -Dtag=ontop-3.0.0
```

### Stage the Maven artifacts

- URL: [https://oss.sonatype.org](https://oss.sonatype.org)
- Navigate to "Staging Repositories" from the left panel
- Close the repository by clicking the `Close` button
- Release the artifacts by clicking the `Release` button

## Build and distribute Ontop bundles

```console
# we can start from the `checkout` directory generated during the Maven release
$ cd target/checkout
$ ./build-release.sh
```

Further info: [Build Instruction](/dev/build)

- Make a release in [Github Releases](https://github.com/ontop/ontop/releases)

- Deploy the packages to [SourceForge](https://sourceforge.net/projects/ontop4obda/files/) by manual upload or sftp.

```console
$ sftp user,ontop4obda@frs.sourceforge.net
$ cd /home/pfs/project/o/on/ontop4obda
# sftp://ghxiao,ontop4obda@frs.sourceforge.net/home/pfs/project/o/on/ontop4obda
```

## Update Docker Hub

- Build the docker image using the script

```console
$ cd ontop/client/docker/
# modify the version number if necessary
$ ./build-image.sh
```

- Push a new image of [ontop/ontop-endpoint](https://hub.docker.com/repository/docker/ontop/ontop-endpoint) to Docker Hub

## Update the Ontop Website

- Update [the guide homepage](/guide)
- Update [the release notes](/guide/releases)

## Update the API example repository

- Update the Ontop version in <https://github.com/ontop/ontop-api-examples>

## Update branches for next development iteration

- Merge the tag for the release to master and the release branch to develop

```console
$ git checkout develop
$ git merge release/v-number #branch

# this step is also for triggering the AutoUpdate of Protege plugin
$ git checkout master
$ git merge v-number # tag
```

## Time for celebration!

- Send release emails to several mail lists and social media
