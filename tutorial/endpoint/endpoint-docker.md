# Setting up an Ontop SPARQL endpoint with Docker

## How to use this image

The Docker image [ontop/ontop](https://hub.docker.com/r/ontop/ontop) is for fast setting up an Ontop SPARQL endpoint.
One can either use this image directly, or create a dedicated image based on this image.

1. Go to the `endpoint/` directory. Alternatively, if you don't have already the tutorial files, you can download [this OWL ontology file](input/university-complete.ttl), [this mapping file](input/university-complete.obda), [this properties file](input/university-complete.properties) and paste them in `input/`.
2. Make sure to have the `jdbc/` directory and the JDBC driver inside.

In addition, we need the [h2 database](../h2.zip) as usual. Assume the h2 database is already running.

**NB**: Linux users have to modify the property `jdbc.url` in [`input/university-complete.docker.properties`](input/university-complete.docker.properties). Replace `host.docker.internal` with the IP address of your machine (you can see it running the `ifconfig` command).


### Use `ontop/ontop` directly

We can start an Ontop SPARQL endpoint by using the `ontop/ontop` image directly.
On Linux/Mac:

```console
docker run --rm \
           -v $PWD/input:/opt/ontop/input \
           -v $PWD/jdbc:/opt/ontop/jdbc \
           -e ONTOP_ONTOLOGY_FILE=/opt/ontop/input/university-complete.ttl \
           -e ONTOP_MAPPING_FILE=/opt/ontop/input/university-complete.obda \
           -e ONTOP_PROPERTIES_FILE=/opt/ontop/input/university-complete.docker.properties \
           -p 8080:8080 \
           ontop/ontop
```

On Windows:
```console
docker run --rm ^
           -v %CD%/input:/opt/ontop/input ^
           -v %CD%/jdbc:/opt/ontop/jdbc ^
           -e ONTOP_ONTOLOGY_FILE=/opt/ontop/input/university-complete.ttl ^
           -e ONTOP_MAPPING_FILE=/opt/ontop/input/university-complete.obda ^
           -e ONTOP_PROPERTIES_FILE=/opt/ontop/input/university-complete.docker.properties ^
           -p 8080:8080 ^
           ontop/ontop
```

Now we can open <http://localhost:8080/> to test SPARQL queries.

### Create a dedicated image

In case we want to deploy a self-contained image, we can write a complete [`Dockerfile`](Dockerfile):

```dockerfile
FROM ontop/ontop
WORKDIR /opt/ontop
COPY input/university-complete.ttl input/university-complete.obda input/university-complete.docker.properties input/ 
COPY jdbc/h2-1.4.196.jar jdbc/
EXPOSE 8080
ENTRYPOINT java -cp ./lib/*:./jdbc/* -Dlogback.configurationFile=file:./log/logback.xml \
        it.unibz.inf.ontop.cli.Ontop endpoint \
        --ontology=input/university-complete.ttl \
        --mapping=input/university-complete.obda \
        --properties=input/university-complete.docker.properties \
        --cors-allowed-origins=http://yasgui.org \
        --lazy # if needed
```

Then, run the commands to build and run the Docker image:

```console
$ docker build -t my-ontop-endpoint .
$ docker run -it --rm --name my-running-ontop-endpoint -p 8080:8080 my-ontop-endpoint
```

### Use Docker-compose

Docker-compose allows setting up a number of containers together. 
For example, the following [`docker-compose.yml`](docker-compose.yml) file creates a cluster consisting of an H2 database (`db`) and an Ontop SPARQL endpoint (`ontop`). 

```yaml
version: '3.4'

services:
  db:
    image: openjdk:8-jdk-alpine
    volumes:
      - ./h2:/opt/h2
    command: [ "java", "-cp", "/opt/h2/bin/h2-1.4.196.jar", "org.h2.tools.Server", "-tcpAllowOthers" ]
    ports:
      - "8082:8082"
      - "9082:9082"
  ontop:
    image: ontop/ontop
    environment:
      ONTOP_ONTOLOGY_FILE: /opt/ontop/input/university-complete.ttl
      ONTOP_MAPPING_FILE: /opt/ontop/input/university-complete.obda
      ONTOP_PROPERTIES_FILE: /opt/ontop/input/university-complete.compose.properties
      ONTOP_PORTAL_FILE: /opt/ontop/input/university-complete.portal.toml
      ONTOP_CORS_ALLOWED_ORIGINS: "*"
      ONTOP_DEV_MODE: "true"
      ONTOP_LAZY_INIT: "true"
    volumes:
      - ./input:/opt/ontop/input
      - ./jdbc:/opt/ontop/jdbc
    ports:
      - "8080:8080"
```

Now we can simply start it:

```
$ docker-compose up
``` 

It exposes the following two ports for the browser:
- <http://localhost:8080> H2 Web Console
- <http://localhost:8082> Ontop SPARQL endpoint

