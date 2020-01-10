# Build Ontop Bundles

* Requirements
  * Java 8
  * Maven
  * git
  * zip

* Building Ontop bundles is straightforward: simply invoke `build-release.sh`.

* The files in `ontop-build/dependencies` will be downloaded if they are not there.

* The built bundles are located in `build/distribution/`:
  * `ontop-cli/`: libraries/scripts to use ontop from the command line.
  * `ontop-protege/it.unibz.inf.ontop.protege-[ontop-version].jar`: plugin for Protege 5.x installation files (drop it in Protege’s plugins folder).
  * `ontop-protege/ontop-protege-bundle-[ontop-version].zip` : Protege 5.x bundled with Ontop and JDBC plugins. Ready to run package: just unzip and use the run.sh or run.bat start scripts.
  * `ontop-webapps/`: WAR files required to create an Ontop SPARQL end-point webapp. Drop them into the webapps folder of your Servlet server.
  * `ontop-jetty/` : Jetty 9 + RDF4J workbench + Ontop, ready to run as a SPARQL end-point.
  * `ontop-tomcat/` : Tomcat 8 + RDF4J workbench + Ontop, ready to run as a SPARQL end-point.
