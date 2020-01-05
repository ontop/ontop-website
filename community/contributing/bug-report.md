# Bug report

If you are sure you found a bug, use [GitHub Issues](https://github.com/ontop/ontop/issues) to submit the report; otherwise, start a discussion in the [mailing list](https://groups.google.com/d/forum/ontop4obda).

When reporting a bug, please make sure that you are using [the latest version of Ontop](/guide/getting-started) and provide a minimal reproducible example.

## Reporting a possible bug
* Perform a search between current and past issues. If it is an open issue, add a comment to the existing issue instead of opening a new one.
* Let us know which version and which setting of Ontop you are using (Protégé, SPARQL endpoint, CLI, Java API)
* State what happened and also state what you expected to see.
* If you have precise steps to reproduce the bug, explain each step and send us a set of ontology/mappings/query (as small as possible) so we can reproduce the problem. Otherwise send us the complete ontology, mapping and query files.
* If you cannot reliably reproduce the test provide details about how often the problem happens and under which conditions it normally happens.
* If the program generated an error, report what the error message was and how it occurred.
* Add the log file in debug mode to help us to track the issue (more information follows).

### How to generate the log file

#### Enable Protégé log

You should go to the folder *conf* of Protégé and modify the line of the *logback.xml* file from `<root Level="info">` to `<root Level="debug">`.
When you restart Protégé you will have more information in the command line, that can be useful to understand the problem.
You can send us the generated log file from Protégé starting from *Window -> Show log... -> Show log file -> protege.log*

#### Enable Command Line Interface log
By default command line interface has already the debug mode set. You can find the information about the log in the ontop distribution to the folder *log*.

#### Enable RDF4J log
It is possible to see the log of the RDF4 Workbench by going to the data directory [Rdf4j_DATA]. 
RDF4J Server stores by default its data in a directory *%APPDATA%\Rdf4j* (on Windows),
*\$HOME/.rdf4j* (on Linux), or *$HOME/Library/Application Support/Rdf4j* (on Mac OSX).
Change the log to `DEBUG` in */OpenRDF Sesame/conf/logback.xml*. 
Modify the line of the *logback.xml* file from `<root Level="info">` to `<root Level="debug">`.
After running the test, get the log file from */Rdf4j/logs*.

## Asking for help or information
If you are not reporting a bug but just asking for help using the program:
* Have a look at our [documentation](/guide).
* Check our [FAQ](/guide//troubleshooting/faq) page.
* Please state where you have already looked for the answer to your question, this will help us improve or update our documentation.
