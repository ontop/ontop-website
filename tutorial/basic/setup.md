# Database and Ontop Setup

In this tutorial, we are considering fragments of the information systems
of two universities describing students, academic staff and courses.

## Database setup

Procedure to set up the datebase for the following exercises:

1. Unzip the archive of H2 [*(h2.zip)*](../h2.zip)
2. Start the database:
   * On Mac/Linux: open a terminal, go into *h2/bin* and run `sh h2.sh`
   * On Windows: click on the executable `h2w.bat`
3. After being automatically redirect to the web interface of H2, connect with the default parameters:
     * JDBC URL:  *jdbc:h2:tcp://localhost/../university-session1*
     * User name: *sa*
     * No password
4. Now you can see the tables in the schema *uni1*.
5. Try a first SQL query: "Give me the last names of the full professors"

```sql
SELECT "last_name"
FROM "uni1"."academic"
WHERE "position" = 1
```

## Ontop-Protégé setup

Protégé is an open source ontology editor and knowledge management system. Ontop-Protégé is a plugin for designing and testing a VKG specification.

0. [Download](https://sourceforge.net/projects/ontop4obda/files/ontop-3.0.0/ontop-protege-bundle-3.0.0.zip/download) and unzip the Protégé-bundle archive and go into its folder
1. Run it (*run.bat* on Windows, *run.sh* on Mac/Linux)
2. Register the H2 JDBC driver: go to "Preferences", "JDBC Drivers" and add an entry with the following information
     * Description: *h2*
     * Class Name: *org.h2.Driver*
     * Driver file (jar): */path/to/h2/bin/h2-1.4.196.jar*

## Programme


 1. [Mapping the first data source](university-1.md)
 2. [Mapping the second data source](university-2.md)