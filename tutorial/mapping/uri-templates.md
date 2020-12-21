# Choice of the IRI templates

The choice of IRI templates may impact query complexity and performance, depending on whether joins have to be introduced to materialize those templates.

Until now, we have been using local identifiers from the data sources to build three different IRI templates for the persons of the two universities:
  - `ex:uni1/student/{*}`
  - `ex:uni1/academic/{*}`
  - `ex:uni2/person/{*}`

Let us now consider the case where the tables `uni1.student`, `uni1.academic` and `uni2.person` have
a new column: `ssn`. This column corresponds to the social security number of the person.

This new column gives us the opportunity to use a common IRI template for all the persons. Such IRI template would allow us to collect information about a person registered in both universities.

As we will see, there are actually some persons that are teaching or studying in both universities.

Given that we already have the mapping assertions produced during the first session, we will consider
two ways to change the IRI templates: first by doing it manually, then using the notion of *canonical IRIs*.

We will also see that using this new IRI template has a negative impact on the performance of some queries.

## Manual approach

Download the following files: 
  - [university-manual-ssn.ttl](university-manual-ssn.ttl) 
  - [university-manual-ssn.obda](university-manual-ssn.obda)
  - [university-manual-ssn.properties](university-manual-ssn.properties)

The mapping assertions are currently the same as during the first hands-on session.
Let us now update them with the new IRI template for persons.

#### Mapping uni1.student
 * Target:
```turtle
ex:person/{ssn} a :Student ;
   foaf:firstName {first_name}^^xsd:string ; foaf:lastName {last_name}^^xsd:string .
```
 * Source:
```sql
SELECT * FROM "uni1"."student"
```

#### Mapping uni1-academic
 * Target:
```turtle
ex:person/{ssn} a :FacultyMember ;
    foaf:firstName {first_name}^^xsd:string ;
    foaf:lastName {last_name}^^xsd:string .
```
 * Source:
```sql
SELECT *
FROM "uni1"."academic"
```

#### Mapping uni1-teaching
 * Target:
```turtle
ex:person/{ssn} :teaches ex:uni1/course/{c_id} .
```
 * Source:
```sql
SELECT ac."ssn", te."c_id"
FROM "uni1"."teaching" te, "uni1"."academic" ac
WHERE te."a_id" = ac."a_id"
```

As you can see, a join is needed to get the SSN of the teacher.


#### Mapping uni1-registration
 * Target:
```turtle
ex:person/{ssn} :attends ex:uni1/course/{c_id} .
```
 * Source:
```sql
SELECT st."ssn", re."c_id"
FROM "uni1"."course-registration" re, "uni1"."student" st
WHERE re."s_id" = st."s_id"
```

#### Mapping uni1-fullProfessor
 * Target:
```turtle
ex:person/{ssn} a :FullProfessor .
```
 * Source:
```sql
SELECT *
FROM "uni1"."academic"
WHERE "position" = 1
```

Then proceed in a similar way for the other positions (assistant professor, postdoc, etc.).

#### Mapping uni2.person
 * Target:
```turtle
ex:person/{ssn} a foaf:Person ;
    foaf:firstName {fname}^^xsd:string ;
    foaf:lastName {lname}^^xsd:string .
```
 * Source:
```sql
SELECT *
FROM "uni2"."person"
```

#### Mapping uni2-lecturer
 * Target:
```turtle
ex:person/{ssn} :givesLecture ex:uni2/course/{cid} .
```
 * Source:
```sql
SELECT pe."ssn", co."cid" 
FROM "uni2"."course" co, "uni2"."person" pe
WHERE co."lecturer" = pe."pid"
```

#### Mapping uni2-lab-teacher
 * Target:
```turtle
ex:person/{ssn} :givesLab ex:uni2/course/{cid} .
```
 * Source:
```sql
SELECT pe."ssn", co."cid"
FROM "uni2"."course" co, "uni2"."person" pe
WHERE co."lab_teacher" = pe."pid"
```

#### Mapping uni2-registration
 * Target:
```turtle
ex:person/{ssn} :attends ex:uni2/course/{cid} .
```
 * Source:
```sql
SELECT pe."ssn", re."cid"
FROM "uni2"."registration" re, "uni2"."person" pe
WHERE re."pid" = pe."pid"
```


#### Mapping uni2-undergraduate
 * Target:
```turtle
ex:person/{ssn} a :UndergraduateStudent .
```
 * Source:
```sql
SELECT *
FROM "uni2"."person"
WHERE "status" = 1
```
Then proceed in a similar way for the other positions (assistant professor, postdoc, etc.).

### SPARQL queries

With the new mapping assertions, the following SPARQL query should now return some results:

```sparql
PREFIX : <http://example.org/voc#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT DISTINCT ?firstName ?lastName ?ins1 ?ins2 {
   ?p foaf:firstName ?firstName ;
      foaf:lastName ?lastName ;
      :teaches [ :isGivenAt ?ins1 ],
           [ :isGivenAt ?ins2 ] .

  FILTER(str(?ins1) < str(?ins2))
}
```

However, if you execute another variant, you will see it is now very inefficient:

```sparql
PREFIX : <http://example.org/voc#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?firstName ?lastName ?ins1 ?ins2 {
   ?p1 foaf:firstName ?firstName ;
      foaf:lastName ?lastName ;
      :teaches [ :isGivenAt ?ins1 ] .

   ?p2 foaf:firstName ?firstName ;
      foaf:lastName ?lastName ;
      :teaches [ :isGivenAt ?ins2 ] .

  FILTER(str(?ins1) < str(?ins2))
}
```
Look at the SQL query, it should be very long as it suffers from a substantial exponential blowup.
Note that the first query also suffers from an exponential blowup but the latter is less important and thus less sensible on our small dataset.


## Canonical IRIs

Instead of changing the mapping assertions manually, Ontop allows you to declare a canonical IRI template for `ex:uni1/student/{*}`, `ex:uni1/academic/{*}` and `ex:uni2/person/{*}`.

This takes the form of three additional mapping assertions that can be found in the [university-canonical.ttl](university-canonical.ttl), [university-canonical.obda](university-canonical.obda), and [university-canonical.properties](university-canonical.properties) files.

#### Mapping uni1-academic-canonical
 * Target:
```turtle
:person/{ssn} obda:isCanonicalIRIOf :uni1/academic/{a_id} . 
```
 * Source:
```sql
SELECT * FROM "uni1"."academic"
```

#### Mapping uni1.student-canonical
 * Target:
```turtle
:person/{ssn} obda:isCanonicalIRIOf :uni1/student/{s_id} . 
```
 * Source:
```sql
SELECT * FROM "uni1"."student"
```

#### Mapping uni2.person-canonical
 * Target:
```turtle
:person/{ssn} obda:isCanonicalIRIOf :uni2/person/{pid} . 
```
 * Source:
```sql
SELECT * FROM "uni2"."person"
```

With these three mapping assertions and the ones of the first session, Ontop produces the same saturated mapping assertions as in the manual approach.
Query evaluation performance is thus the same (and similarly affected to the additional joins needed to build person IRIs), but the use of canonical IRI templates makes simpler for users to define and adapt mappings.
