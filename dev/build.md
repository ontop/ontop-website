# Build Ontop Bundles

### Requirements

* a Linux, Mac OS X or Windows machine;

* git, for checking out Ontop code (refer to installation instructions for your OS/distribution);

* Java 8 (JDK, not JRE, refer to installation instructions for your OS/distribution);

* JAVA_HOME environment variable correctly set up and pointing to a Java 8 JDK.
  Run `echo $JAVA_HOME` (on Windows: `echo %JAVA_HOME%`) and check the path printed (if any).
  If the variable is unset, you can set it temporarily in the terminal session using `export JAVA_HOME=[path]` (on Windows: `setx JAVA_HOME -m "[path]"`), where [path] points to the JDK installation (the directory containing bin, lib, etc).
  This setting may be made persistent by editing your ~/.bash_profile (on Windows, edit System and Security > System > Advanced System Settings > Environment Variables). In particular, for Mac OS X
  ```console
  $ vim ~/.bash_profile 
  Add this line:  export JAVA_HOME=$(/usr/libexec/java_home)
  $ source ~/.bash_profile
  ```

* Maven 3.6.0 or later, with `mvn` command available on `PATH`. Run
  ```console
  $ mvn -v
  Apache Maven 3.6.1 (d66c9c0b3152b2e69ee9bac180bb8fcc8e6af555; 2019-04-04T21:00:29+02:00)
  Maven home: /opt/maven/current
  Java version: 1.8.0_275, vendor: AdoptOpenJDK, runtime: /usr/lib/jvm/adoptopenjdk-8-hotspot-amd64/jre
  Default locale: en_US, platform encoding: UTF-8
  OS name: "linux", version: "4.19.0-12-amd64", arch: "amd64", family: "unix"
  ```
  Check the versions of Maven (3.6.1 > 3.6.0 in the example) and Java (1.8.0_275, i.e. Java 8).


### Checkout Ontop source code

In a terminal, move to the parent directory where you want to checkout Ontop, and run
```
$ git checkout https://github.com/ontop/ontop.git
$ cd ontop
```

  
### Build all bundles

From the root directory of Ontop source code tree, run
```console
$ mvn -Prelease -DskipTests
```

The command compiles Ontop modules and generates the Ontop bundles distributed on GitHub, whose files are written in directory `build/distribution/target` and include:
* `ontop-cli-[ontop-version].zip` - libraries/scripts to use ontop from the command line and setup a SPARQL endpoint;
* `it.unibz.inf.ontop.protege-[ontop-version].jar` - plugin for Protégé 5.x installation files (drop it in Protégé’s plugins folder);
* `ontop-protege-bundle-platform-independent-[ontop-version].zip` - Protégé 5.x bundled with Ontop plugin and ready to run (just unzip and use the run.sh or run.bat scripts);
* `ontop-protege-bundle-linux-[ontop-version].zip` - as above, for Linux;
* `ontop-protege-bundle-os-x-[ontop-version].zip` - as above, for Mac OS X;
* `ontop-protege-bundle-win-[ontop-version].zip` - as above, for Windows.

Notes:
* profile activation `-Prelease` enables the generation of the Ontop bundles (if omitted, only JAR files for Ontop modules are created);
* option `-DskipTest` disables the execution of unit and integration tests (generally performed at release time) to speed up the process - omit it to enable tests (e.g., to test changes to source code);
* in Ontop version 4.0.3 or earlier, the build must be performed via Bash script `build-release.sh` (Linux and Mac OS X only) and generated bundles are written to sub-directories ontop-cli, ontop-protege, and ontop-webapps of directory build/distribution. The script also generated bundles for Jetty 9 + RDF4J workbench + Ontop and for Tomcat 8 + RDF4J workbench + Ontop. These bundles are [deprecated and no more supported](https://ontop-vkg.org/guide/releases.html#_4-0-0-rc-1-july-8-2020), but users may still setup these Jetty / Tomcat configurations by generating and using the WAR files as detailed next.


### Build specific bundles

Starting from version `4.1`, we provide Maven profiles to build specific Ontop bundles as quickly as possible (with respect to using the above 'build all' command), which may come in handy when modifying Ontop source code. Specifically:

* to build the Ontop command line tool only (i.e., `ontop-cli-[ontop-version].zip`)
  ```console
  $ mvn -Pcli
  ```

* to build the Ontop Protégé plugin (`it.unibz.inf.ontop.protege-[ontop-version].jar`) and the Protégé bundles including it (files `ontop-protege-bundle-[platform]-[ontop-version].zip`)
  ```console
  $ mvn -Pprotege
  ```

* to build the WARs for RDF4J server and workbench applications extended with support for Ontop repositories (file `ontop-webapps-[ontop-version].zip`)
  ```console
  $ mvn -Pwebapps
  ```
  **Note**: this bundle is no more part of Ontop release (as of version 4.1) but can still be built locally by users. The produced zip contains two WAR files that can be dropped into any Servlet container of choice, including Tomcat and Jetty.

The Maven profiles (cli, protege, webapps) employed in the commands above exclude unneeded artifacts, javadocs generation, and testing from the build, which is thus faster. These profiles can be arbitrarily combined to produce multiple bundles (e.g., `mvn -Pcli,webapps` to generate both command line tool and WARs).


### Other useful Maven commands

Also starting from version `4.1`, we provide additional Maven profiles to facilitate some build-related development tasks, as listed next:

* to perform various Maven analyses on the Ontop Maven project as a whole
  ```console
  $ mvn -Panalyze
  ```
  The profile currently uses `maven-dependency-plugin` and `versions-maven-plugin` to report (on standard output) information about which build plugins and dependencies can be updated, and whether there are conflicts, duplications or other problems involving declared dependencies;

* to list third-party libraries and their licenses
  ```
  $ mvn -Pthirdparty
  ```
  The profile uses the `license-maven-plugin` and some additional configuration (in `build/settings`) to produce a report file `build/distribution/THIRD-PARTY.txt` that may be useful to assess that only Java libraries with compatible licenses are included in Ontop.
  
* to auto-format `pom.xml` files in the project
  ```
  $ mvn -Pformat
  ```


