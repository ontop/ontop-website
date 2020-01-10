# Intermediate Query

Input queries for Ontop are expressed in (a fragment of) SPARQL 1.1,
whereas the output of the query reformulation process is expressed in the query language used by the underlying DBMS (prototypically some variant of SQL
but also other query languages like the MongoDB Aggregate Framework).

Because most query rewriting and optimization steps apply regardless of the underlying DBMS,
a DBMS-independent query representation format is used internally.
This format is called _intermediate query_ and allows for the representation of queries and mapping assertions.

## IQ and IntermediateQuery classes

In terms of implementation, there are two alternative classes corresponding to intermediate queries:
  * The class `IntermediateQuery` which is mutable (deprecated)
  * The class `IQ` which is immutable.

`IntermediateQuery` has been introduced first at the time when it was expected than mutability was needed for performance. 
`IQ` has been introduced later when immutability would also do the job efficiently while simplifying the code.

`IntermediateQuery` is now deprecated and the optimizations implemented with this data structure will be progressively re-implemented.
In terms of semantics, they are exactly the same. Both use `QueryNode` as nodes.


## Query nodes

::: warning TODO: COMPLETE 
NativeNode, AggregationNode, SliceNode, DistinctNode, OrderByNode
:::

An IQ is a standard (rooted and ordered) tree representation of a algebraic query expression.

The underlying algebra is a compromise between (a fragment of) the SPARQL algebra on the one hand,
and the select/project/join/rename/union relational algebra (_RA_ in what follows) with named attributes on the other hand.

The following is an informal description of the different types of nodes which may appear in an IQ.
A formal characterization (in terms of RA algebra) is given in [the dedicated section](/research/iq-formal/).

Optimizations applied to IQs are described in [the dedicated section](/research/optimization/).
 
### Leaf node types

#### Data node

A data node is a prototypical leaf node.

It is characterized by a predicate $p(v_1, \dots, v_n)$,
where each $v_i$ is either a constant or a variable name.

::: warning TODO
Describe intensional and extensional data nodes
:::

#### Empty node

An empty node can be viewed as a specific specific type of data node,
whose evaluation will always be an empty set of tuples.

See [the dedicated section](/research/iq-formal#empty-node) for a precise characterization.

#### True node

True nodes represent another limit case,
namely an expression whose evaluation will always be a singleton set containing the 0-ary tuple.

See [the dedicated section](/research/iq-formal#true-node) for a precise characterization.

### Non-leaf node types

#### Filter node
A filter node represents an RA selection over the evaluation of its (unique) child node.

#### Inner join node
An inner join node represents the RA n-ary natural join of the evaluations of its children nodes.

Explicit joining conditions may also be attached to it.

See [the dedicated section](/research/iq-formal#inner-join-node) for a precise characterization.

#### Left join node
A left join node represents the RA binary natural left outer join of the evaluations of its children nodes.
The left and right children nodes respectively stand for the left and right part of the join.

Explicit joining conditions may also be attached to it.

See [the dedicated section](/research/iq-formal#left-join-node) for a precise characterization.

#### Union node

A union node represents the RA n-ary union of the evaluations of its children nodes,
possibly preceded by a (unique) projection applied to each of them.

See [the dedicated section](/research/iq-formal#union-node) for a precise characterization.

#### Construction node

A construction node represents a sequence of (at most) three operations applied to the evaluation of its unique child node:

* a projection,
followed by
* the application of a function to the values of each retrieved tuple,
followed by
* a variable renaming.

For instance,
a construction node may first project out variables $x$ and $y$,
then prepend the string "http://domain/" to each value retrieved for $x$,
and finally rename variable $x$ with $z$.

Each of these three operations is optional. 

See [the dedicated section](/research/iq-formal#construction-node) for a precise characterization.


## Previous query format (version 1)

Datalog was the main internal query representation format in Version 1 of Ontop,
due in particular to its close similarity with conjunctive queries,
which were the only supported input queries.
The switch to SPARQL input queries increased expressiveness,
making their rule-based representation more complex (due in particular to the the SPARQL OPTIONAL operator,
which,
roughly speaking,
corresponds to the SQL left outer join).
The intermediate query format on the other hand offers a relatively straightforward internal representation,
not only of SPARQL queries,
but also of the queries sent to underlying DBMS (at least the SQL-like ones),
as well as complex mapping assertions (which,
in most scenarios,
contains SQL queries).
This is also why the rule-based internal representation has been progressively abandoned.
