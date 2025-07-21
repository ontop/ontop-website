# Build snapshots

## Maven

Add the credentials for `central` (Maven Central) in your `.m2/settings.xml`.


```bash
mvn deploy -DskipTests -pl '!protege/dependencies,!protege/plugin,!protege/distribution'
```