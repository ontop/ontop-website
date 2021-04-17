# Debug Protégé


This page describe how to debug the Protégé Plugin of Ontop from IntelliJ.

If you just want to test the plugin (without debugging), you only need to follow the step of building the Protégé plugin, and then run Protégé as usual (use `run.bat` on Windows)
```console
$ Protege-[protege-version]/run.sh
```

## Build the Protégé plugin

### Requirements

Checkout and build Ontop source code as described [here](/dev/build).
We assume all commands listed below are issued from the root directory of Ontop source tree.


### First time build

Unzip the Ontop Protégé bundle (obtained by previously building Ontop source code), which contains Protégé preconfigured with the Ontop Protégé plugin
```console
$ unzip build/distribution/target/ontop-protege-bundle-platform-independent-[ontop-version].zip
```

Notes:
* for older versions of Ontop (up to 4.0.3) the bundle to unzip is located in `build/distribution/ontop-protege`;
* you may also reuse a (platform independent) Protégé distribution obtained directly from Protégé web site and already installed locally. In this case make sure that the Protégé version matches the one used during Ontop build, that Protégé directory contains a `plugins` sub-directory (create it if missing), and run the commands below to deploy the Ontop Protégé plugin (adapting paths accordingly).


### Subsequent builds

**Each time you modify the code, you need to recompile and build the Ontop distribution.**

The fastest command to re-compile the Ontop Protégé plugin and the code it depends on is
```console
$ mvn clean package -pl client/protege -am -Pprotege
```

Notes: 
- goal `clean` forces a full re-build and may be generally omitted (unless you encounter build errors, in which case `clean` helps ruling out they stem from incremental builds);
- options `-pl client/protege -am` tell Maven to only build the Ontop Protégé module located in `client/protege` and all the other Ontop modules it depends on;
- profile activation `-Pprotege` tunes the build for generating Ontop Protégé artifacts, e.g., excluding irrelevant artifacts, javadoc generation and testing (if omitted, the build process takes longer);
- in Ontop version 4.0.3 or earlier, the command above should be replaced by `mvn clean install -pl client/protege -am -DskipTests` to compile code and install it in local maven repository, followed by `mvn bundle:bundle -pl client/protege` to package the plugin.
  
Once the Ontop Protégé plugin is built, it must be copied to the Protégé plugin directory via
```console
$ cp client/protege/target/it.unibz.inf.ontop.protege-[ontop-version].jar Protege-[protege-version]/plugins/
```
The command above should replace any previous Ontop Protégé plugin in the `plugins` directory. In any case, **make sure that there is only one Protégé plugin in `Protege-[protege-version]/plugins/`**


## Debug in IntelliJ using the Remote debugger

### IntelliJ configuration

Create a remote configuration:

* select 'Edit configurations', click '+', then select 'Remote'
* Host: `localhost`
* Port: choose a port number (`5005` in what follows) 

### Protégé run options

Edit the script `Protege-[protege-version]/run.sh` (on Windows: `run.bat`), adding the following JVM option (note that parameter `suspend` is set to `y`)
```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5005
```

### Run / Debug

Execute `Protege-[protege-version]/run.sh` (on Windows: `run.bat`).
Then, from IntelliJ, click on the Debug button (or Shift+F9).
