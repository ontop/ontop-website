# Build Ontop Bundles

### Requirements

* a Linux, Mac OS X or Windows machine;

* git, for checking out Ontop code (refer to installation instructions for your OS/distribution);

* Java 11 (JDK, not JRE, refer to installation instructions for your OS/distribution);

* JAVA_HOME environment variable correctly set up and pointing to a Java 11 JDK.
  Run `echo $JAVA_HOME` (on Windows: `echo %JAVA_HOME%`) and check the path printed (if any).
  If the variable is unset, you can set it temporarily in the terminal session using `export JAVA_HOME=[path]` (on Windows: `setx JAVA_HOME -m "[path]"`), where [path] points to the JDK installation (the directory containing bin, lib, etc).
  This setting may be made persistent by editing your `~/.bash_profile` (on Windows, edit System and Security > System > Advanced System Settings > Environment Variables). In particular, for Mac OS X
  ```console
  $ vim ~/.bash_profile
  Add this line:  export JAVA_HOME=$(/usr/libexec/java_home)
  $ source ~/.bash_profile
  ```

* Maven 3.6.0 or later, with `mvn` command available on `PATH`. Run
  ```console
  $ mvn -v
  Apache Maven 3.9.0 (9b58d2bad23a66be161c4664ef21ce219c2c8584)
  Maven home: /opt/maven/current
  Java version: 11.0.17, vendor: Debian, runtime: /usr/lib/jvm/java-11-openjdk-amd64
  Default locale: en_US, platform encoding: UTF-8
  OS name: "linux", version: "6.1.0-3-amd64", arch: "amd64", family: "unix"
  ```
  Check the versions of Maven (3.9.0 > 3.6.0 in the example) and Java (11.0.17, i.e. Java 11).


### Checkout Ontop source code

In a terminal, move to the parent directory where you want to checkout Ontop, and run
```
$ git clone https://github.com/ontop/ontop.git
$ cd ontop
```


### Build all bundles

Starting from Ontop 4.1, from the root directory of Ontop source code tree, run
```console
$ mvn -Dmaven.test.skip -Prelease
```

The command compiles Ontop modules and generates the Ontop bundles distributed on GitHub, whose files are written in two directories.

Under `build/distribution/target/`:
* **`ontop-cli-[ontop-version].zip`** - libraries/scripts to use ontop from the command line and setup a SPARQL endpoint;

Under `protege/distribution/target/`:
* **`it.unibz.inf.ontop.protege-[ontop-version].jar`** - plugin for Protégé 5.x installation files (drop it in Protégé’s plugins folder);
* **`ontop-protege-bundle-platform-independent-[ontop-version].zip`** - Protégé 5.x bundled with Ontop plugin and ready to run (just unzip and use the `run.sh` or `run.bat` scripts);
* **`ontop-protege-bundle-linux-[ontop-version].zip`** - as above, for Linux;
* **`ontop-protege-bundle-os-x-[ontop-version].zip`** - as above, for Mac OS X;
* **`ontop-protege-bundle-win-[ontop-version].zip`** - as above, for Windows.

Notes:
* profile activation `-Prelease` enables the generation of all the Ontop bundles as well as source code and Javadoc JARs needed for publishing on Maven Central (if this profile is omitted, only JAR files for Ontop binaries are created);
* option `-Dmaven.test.skip` disables the compiling and execution of unit and integration tests (generally performed at release time) to speed up the process - omit it to enable tests, e.g., for testing changes to source code (note: may also use `-DskipTests` that disables executing tests, but still compiles them);
* the build may be performed also by running script `build-release.sh` (`build-release.cmd` on Windows), which works also in older Ontop versions (4.0.3 or earlier). In these older versions, the script generates bundles in sub-directories `ontop-cli`, `ontop-protege`, and `ontop-webapps` of directory `build/distribution`, and also generates bundles for Jetty 9 + RDF4J workbench + Ontop and for Tomcat 8 + RDF4J workbench + Ontop. These bundles have been [deprecated in Ontop 4](https://ontop-vkg.org/guide/releases.html#_4-0-0-rc-1-july-8-2020) and [completely removed since Ontop 5](https://ontop-vkg.org/guide/releases.html#_5-0-0-december-31-2022).


### Build specific bundles

Starting from version `4.1` and further revised in version `5.0.2`, we provide Maven profiles to build specific Ontop bundles as quickly as possible (with respect to using the above 'build all' command), which may come in handy when modifying Ontop source code. Specifically:

* to build the Ontop command line tool only, i.e., `ontop-cli-[ontop-version].zip` (note: up to version `5.0.1`, `asset-cli` was `cli` and tests were disabled by default)
  ```console
  $ mvn -Dmaven.test.skip -Passet-cli
  ```

* to build the Ontop Protégé plugin, i.e., `it.unibz.inf.ontop.protege-[ontop-version].jar` (profile available since version `5.0.2`)
  ```console
  $ mvn -Dmaven.test.skip -Passet-plugin
  ```

* to build the Ontop Protégé plugin `it.unibz.inf.ontop.protege-[ontop-version].jar` as well as the `ontop-protege-bundle-[platform]-[ontop-version].zip` Protégé bundles including it (note: up to version `5.0.1`, `asset-protege` was `protege` and tests were disabled by default)
  ```console
  $ mvn -Dmaven.test.skip -Passet-protege
  ```

The Maven profiles `asset-cli`, `asset-plugin`, `asset-protege` employed in the commands above exclude unneeded artifacts from the build, which is thus faster. These profiles can be arbitrarily combined to produce multiple bundles, e.g., `mvn -Passet-cli,asset-protege` to generate both command line tool and Protégé bundles (from version 4.1 up to version 5 excluded, it was possible to build the RDF4 workbench + Ontop files by enabling profile `webapps`, now removed).


### Compiling the Ontop Protégé plugin

Starting from version `5.0.2`, it is necessary to enable profile `plugin` (or a profile depending on it, such as `asset-plugin`, `asset-protege`, or `release`) in order to compile `ontop-protege-plugin`. Note that **commands `mvn compile` and `mvn test` will not work with profile `plugin`** (or a depending profile) since compiling/testing `ontop-protege-plugin` requires building `ontop-protege-dependencies:shaded` first to [relocate Guava via the Maven shade plugin](https://maven.apache.org/plugins/maven-shade-plugin/examples/class-relocation.html), but this happens only during the `package` lifecycle phase of Maven, i.e., starting from `mvn package` or later phase. Unfortunately, relocating Guava is needed to avoid conflicts with the older Guava version used in Protégé and cannot be avoided, and doing that before the `package` phase is not feasible. Therefore, developers should **always use `mvn package -Pplugin` or later phase when working with `ontop-protege-plugin`**, even when just compiling or testing is intended.


### Other useful Maven commands

The following Maven commands can be used to facilitate some build-related development tasks, the involved plugins (e.g., `license-maven-plugin`) being already configured in Ontop root `pom.xml` file:

* `mvn license:add-third-party` - produces a report file `build/distribution/THIRD-PARTY.txt` useful to verify the use of Java libraries with compatible licenses
* `mvn org.codehaus.mojo:versions-maven-plugin:display-plugin-updates` - check for Maven plugins that can be updated
* `mvn org.codehaus.mojo:versions-maven-plugin:display-dependency-updates` - check for dependencies that can be updated
* `mvn dependency:analyze-duplicate` - check there are no duplicate dependencies declared in `pom.xml` files
* `mvn dependency:analyze-dep-mgt` - check that dependency versions under centralized `<dependencyManagement>` sections are not overridden in child `pom.xml` files
* `mvn dependency:analyze` - check for *used and undeclared* dependencies and for *unused and declared* dependencies (both situations that should be avoided)
* `mvn com.github.ekryd.sortpom:sortpom-maven-plugin:sort` - sorts section of `pom.xml` files, to improve consistency
* `mvn net.revelc.code.formatter:formatter-maven-plugin:format` - auto-formats the `pom.xml` files, to improve consistency
