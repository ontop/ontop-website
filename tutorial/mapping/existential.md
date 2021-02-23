# Bonus: existential reasoning

Ontop includes a *tree-witness query rewriting algorithm* implementing *existential reasoning*.

To enable it, in Protégé go to *Preferences* -> *Ontop reasoner* tab and enable the option *reasoning over anonymous individuals*.

Then, restart the reasoner and try the following query that looks for people supervised by some *Professor*:

```sparql
PREFIX : <http://example.org/voc#>

SELECT ?x {
   ?x :isSupervisedBy [ a :Professor ] .
}
```

Note that there is no mapping assertion for the property *isSupervisedBy*.
However, the ontology states that for every *GraduateStudent* there must exist some *Professor* so that the student *isSupervisedBy* the professor.
Ontop can thus infer that all *GraduateStudent* are answers to the query, which is then rewritten as the following equivalent query prior to evaluation:

```sparql
PREFIX : <http://example.org/voc#>

SELECT ?x {
   ?x a :GraduateStudent .
}
```
