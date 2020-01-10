# Debug Jetty

This page describe debug Jetty with RDF4J workbench plugin in IntelliJ Idea


## Start the Jetty in Debug mode 
```
$ java -Xdebug -agentlib:jdwp=transport=dt_socket,address=9999,server=y,suspend=n -jar start.jar
```

## Linking with IntelliJ

Next we need to link the IntelliJ project with the deployed webapp.

1. Within IntelliJ, open the project containing the webapp deployed into jetty that you want to debug. SelectRun -> Edit Configurations. Add a new configuration by clicking the "+" icon. Choose Remote. Make sure the port you choose is the same as the one you added in Enable remote debugging.

2. Next in your webapp you can set a breakpoint within a servlet which when it is tripped will halt the remote jvm's processing thread to await for debugging commands from your IntelliJ instance. To set a breakpoint, simply open the servlet or any other class you want to debug and click left to the line you want to set the breakpoint at (where the red dot is on the next screenshot). The red dot and red background on the line mark the breakpoint.

3. Accessing that servlet within your browser, pointed at your remote debug configurated jetty-distribution, should transition your IntelliJ instance to the standard debugger view.

## References

1. [http://www.eclipse.org/jetty/documentation/current/enable-remote-debugging.html](http://www.eclipse.org/jetty/documentation/current/enable-remote-debugging.html)
2. [http://www.eclipse.org/jetty/documentation/current/debugging-with-intellij.html](http://www.eclipse.org/jetty/documentation/current/debugging-with-intellij.html)
