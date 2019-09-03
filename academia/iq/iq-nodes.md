# Query nodes (academic description)

::: warning
TODO: CHECK/UPDATE (2 years old and formatted in AsciiDocs)
:::

The main internal representation of a query in Ontop is called an _intermediate query_ (denoted with _IQ_ in what follows).
Concretely,
an IQ is a standard (rooted and ordered) tree representation of a algebraic query expression (more exactly,
for each node N of a well-formed IQ Q,
the maximal subtree or Q rooted in N represents a valid algebraic expression).

The underlying algebra is a compromise between (a fragment of) the SPARQL algebra on the one hand,
and the select/project/join/rename/union relational algebra (_RA_ in what follows) with named attributes on the other hand.

The following is an informal description of the different types of nodes which may appear in an IQ.
A formal characterization (in terms of RA algebra) is given in Section link:intermediateQuery_detailed.adoc[Intermediate query: formal characterization].

Optimizations applied to IQs are described in link:intermediateQuery_optimization.adoc[the dedicated section].
 
## Leaf node types

### Data node

A data node is a prototypical leaf node.

It is characterized by a predicate p(v~1~, .., v~n~),
where each v~i~ is either a constant or a variable name.

Variable names can informally be viewed as SPARQL variables (or as RA attributes).

See link:intermediateQuery_detailed.adoc#dataNode[the dedicated section] for a precise characterization.

### Empty node

An empty node can be viewed as a specific specific type of data node,
whose evaluation will always be an empty set of tuples.

See link:intermediateQuery_detailed.adoc#emptyNode[the dedicated section] for a precise characterization.

### True node

True nodes represent another limit case,
namely an expression whose evaluation will always be a singleton set containing the 0-ary tuple.
Note that if a link:intermediateQuery_detailed.adoc#bagSemantic[bag semantic] is adopted,
this tuple may have cardinality > 1.  

See link:intermediateQuery_detailed.adoc#trueNode[the dedicated section] for a precise characterization.

## Non-leaf node types

### Filter node
A filter node represents an RA selection over the evalaution of its (unique) child node.

See link:intermediateQuery_detailed.adoc#FilterNode[the dedicated section] for a precise characterization.

### Inner join node
An inner join node represents the RA n-ary natural join (or SPARQL JOIN) of the evaluations of its children nodes.

Explicit joining conditions may also be attached to it.

See link:intermediateQuery_detailed.adoc#innerJoinNode[the dedicated section] for a precise characterization.

### Left join node
A left join node represents the RA binary natural left outer join (or SPARQL OPTIONAL) of the evaluations of its children nodes.
The left and right children nodes respectively stand for the left and right part of the join.

Explicit joining conditions may also be attached to it.

See link:intermediateQuery_detailed.adoc#leftJoinNode[the dedicated section] for a precise characterization.

### Union node

A union node represents the RA n-ary union (or equivalently SPARQL UNION) of the evaluations of its children nodes,
possibly preceded by a (unique) projection applied to each of them.

See link:intermediateQuery_detailed.adoc#unionNode[the dedicated section] for a precise characterization.

### Construction node

A construction node represents a sequence of (at most) three operations applied to the evaluation of its unique child node:

* a projection,
followed by
* the application of a function to the values of each retrieved tuple,
followed by
* a SPARQL variable (aka RA attribute) renaming.

For instance,
a construction node may first project out variables ?x and ?y,
then prepend the string "http://domain/" to each value retrieved for ?x,
and finally rename variable ?x with ?z.

Each of these three operations is optional. 

See [the dedicated section]() for a precise characterization.
