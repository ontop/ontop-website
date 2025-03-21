# First data source: university 1


As a first step, we focus on the database of a first university. It has
the schema *uni1*.
It is composed of 5 tables.

#### *uni1.student*

The table *uni1.student* contains the local ID, first and last names of the students.

s_id | first_name |  last_name
---- | ---------- | ----------
  1  | Mary       | Smith
  2  | John       | Doe

The column *s_id* is a primary key.  

#### *uni1.academic*

Similarly, the table *uni1.academic* contains the local ID,
first and last names of the academic staff, but also information about their position.

a_id | first_name |  last_name | position
---- | ---------- | ---------- | --------
  1  | Anna       | Chambers   | 1
  2  | Edward     | May        | 9
  3  | Rachel     | Ward       | 8

The column *position* is populated with magic numbers:
  - 1 -> Full Professor
  - 2 -> Associate Professor
  - 3 -> Assistant Professor
  - 8 -> External Teacher
  - 9 -> PostDoc

The column *a_id* is a primary key.

#### *uni1.course*

The table *uni1.course* contains the local ID
and the title of the courses.

c_id | title
---- | -----
1234 | Linear Algebra

The column *c_id* is a primary key.

#### *uni1.teaching*

The table *uni1.teaching* contains the n-n relation
between courses and teachers.

c_id | a_id
---- | ----
1234 | 1
1234 | 2

There is no primary key, but two foreign keys to the tables *uni1.course* and *uni1.academic*.

#### *uni1.course-registration*

The table *uni1.course-registration* contains the n-n relation
between courses and students.

c_id | s_id
---- | ----
1234 | 1
1234 | 2

There is no primary key, but two foreign keys to the tables *uni1.course* and *uni1.student*.

## Ontology: classes and properties

1. Download [this OWL ontology file](university.ttl).
2. Download [this mapping file](university.obda).
3. Download [this properties file](university.properties).
4. In Protégé, go to *File/Open...* to load the ontology file (be sure you have all three files in the same folder).
5. In the tab *Classes* you can visualize the class hierarchy
   <figure><img src='ontology_classes.png' width="303px"></figure>
6. In the tab *Object properties* you can see the properties *attends*, *isGivenAt*, *isSupervisedBy*, *isTaughtBy* and *teaches* (with its two sub-properties *givesLab* and *givesLecture*).
   <figure><span><img src='ontology_object_properties.png' width="208px"></span></figure>
7. In the tab *Data properties* you can see the properties *firstName*, *lastName* and *title*.
   <figure><img src='ontology_data_properties.png' width="197px"></figure>


## Mappings


1. Go to the *Window* -> *Tabs* -> *Ontop mapping* tab
2. Test the already defined connection configuration using the *Test Connection* button
3. Switch to the *Mapping Manager* tab in the ontop mappings tab
4. You should see a first mapping assertion called *uni1-student*
5. Double-click on it to observe it and then close this pop-up window.

#### Mapping uni1-student

 * Target:
```turtle
:uni1/student/{s_id} a :Student ;
    foaf:firstName {first_name}^^xsd:string ;
    foaf:lastName {last_name}^^xsd:string .
```
 * Source:
```sql
SELECT *
FROM "uni1"."student"
```

Some remarks:
  - The target part is described using a [Turtle-like syntax](/guide/advanced/mapping-language) while the source part is a regular SQL query.
  - We used the primary key `s_id` to create the IRI. [As we will see later](../mapping/primary-keys.md),
    this practice enables Ontop to remove self-joins, which is very important for optimizing
    the query performance.
  - This entry could be split into three mapping assertions

```turtle
:uni1/student/{s_id} a :Student .
:uni1/student/{s_id} foaf:firstName {first_name}^^xsd:string .
:uni1/student/{s_id} foaf:lastName {last_name}^^xsd:string .
```

Let us now add the other mapping assertions by clicking on *create*:

#### Mapping uni1-academic
 * Target:
```turtle
:uni1/academic/{a_id} a :FacultyMember ;
    foaf:firstName {first_name}^^xsd:string ;
    foaf:lastName {last_name}^^xsd:string .
```
 * Source:
```sql
SELECT *
FROM "uni1"."academic"
```

#### Mapping uni1-course
 * Target:
```turtle
:uni1/course/{c_id} a :Course ;
    :title {title} ;
    :isGivenAt :uni1/university .
```
 * Source:
```sql
SELECT *
FROM "uni1"."course"
```

#### Mapping uni1-teaching
 * Target:
```turtle
:uni1/academic/{a_id} :teaches :uni1/course/{c_id} .
```
 * Source:
```sql
SELECT *
FROM "uni1"."teaching"
```

#### Mapping uni1-registration
 * Target:
```turtle
:uni1/student/{s_id} :attends :uni1/course/{c_id} .
```
 * Source:
```sql
SELECT *
FROM "uni1"."course-registration"
```

#### Mapping uni1-fullProfessor
 * Target:
```turtle
:uni1/academic/{a_id} a :FullProfessor .
```
 * Source:
```sql
SELECT *
FROM "uni1"."academic"
WHERE "position" = 1
```

Then proceed in a similar way for the other positions (associate  professor, assistant professor, external teacher, postdoc).


### SPARQL

1. Run Protégé and go to the *Window* -> *Tabs* -> *Ontop SPARQL* tab
2. Select Ontop in the *Reasoner* menu
3. Start the reasoner
4. Add a query in the *Query Manager* and run the following query in *SPARQL query editor*:

```sparql
PREFIX : <http://example.org/voc#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT DISTINCT ?prof ?lastName {
  ?prof a :FullProfessor ; foaf:lastName ?lastName .
}
```

Tip: do a right click on the SPARQL query field to visualize the generated SQL query.

### Inference

Ontop embeds some inference capabilities and is thus capable of answering a query like the following:

```sparql
PREFIX : <http://example.org/voc#>

SELECT DISTINCT ?teacher {
  ?teacher a :Teacher .
}
```

These inference capabilities can be, for a large part, understood as the ability to infer new mappings
from the original mappings and the ontological axioms (e.g. Professor is a sub-class of Teacher). We will discuss it [later in this tutorial](../mapping/foreign-keys.md).

