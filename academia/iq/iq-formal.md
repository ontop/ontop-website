# Formalization of Intermediate Queries

::: warning
TODO: CHECK/UPDATE (2 years old)
:::

This section aims at providing a more precise characterization of an _intermediate query_ (_IQ_ in what follows),
which is the main query representation format used internally in Ontop.

An IQ is a standard (rooted and ordered) tree representation of an algebraic query expression.
More exactly,
for each node N of a well-formed IQ Q,
the maximal subtree or Q rooted in N represents a valid algebraic expression.

In order to give a more precise characterization of this algebra,
we will rely on its similarity with Relational Algebra (_RA_ in what follows),
more exactly the select/project/join/rename/union RA with named attributes (and no duplicate attribute),
extended with additional operators supported by SQL DBMS (and relevant for Ontop's setting).
These additional operators are:

* left outer join (which corresponds to the SPARQL OPTIONAL operator),
and

* extended projection

::: tip NOTE 
As of now, difference is not supported.
:::

For readability,
some similarities with the SPARQL language will also be (informally) higlighted.

NOTE: This is only one possible way of characterizing the meaning of an IQ.
Other options would be for instance relying on (a customized version of) the SPARQL algebra,
or defining from scratch a full-fledged semantic.

link:notation[The first section] introduces some notational conventions,
whereas the following ones present the different types of nodes which may appear in an IQ,
and how they relate to RA operands and operators. 
In order to simplify notation,
their interpretation is first given in terms of set semantics (which is also the standard interpretation of RA).

The extension to bag semantics has specific implications in an OBDA setting,
and is discussed in link:bagSemantics[a dedicated Section].

## Notation

### Interpretation of algebraic expressions
We assume the following mutually disjoint sets:

* a countably infinite domain D being queried,

* a countably infinite set V of variables names (similar to SPARQL variables,
or to a lesser extent to RA attribute names).

* a finite set P of predicates,
and

* For each p &isin; P with arity n > 0,
a set {p_1, .., p_n} of base attribute names.


A database instance will be viewed as a total function I over P,
which,
to each element p of its domain,
associates a set I(p) of partial functions from {p_1, .., p_n} to D.
 
The _signature_ sig(M) of an algebraic query expression M is the set of its base operands,
and it is assumed that for any well-formed M,
sig(M) &subseteq; P holds.

Given a database instance I over P,
the _interpretation_ ||M|| of a well-formed algebraic expression M is built inductively out of all I(p) such that p &isin; sig(M),
by application of algebraic operators.
To each element of its domain,
||.|| associates a (possibly empty) set of partial functions from a unique subset var(M) of V to D.
var(M) will be called the _projected variables_ of M,
and does not depend on ||.||,
but only on M.  

### Interpretation of IQ nodes

If Q is a well-formed IQ,
then nodes(Q) will designate its nodes.
And by extension,
if N &isin; nodes(Q),
then sig(N) (resp. ||N|| and var(N)) will designate the signature (resp. the interpretation and the projected variables) of the algebraic expression represented by (the maximal subtree of Q rooted in) N.

### Boolean expressions
A _boolean expression_ in what follows designates a quantifier-free first-order formula,
with variables in V,
constants in D and predicates among the ones listed link:[in the dedicated section].


For instance,
x &ne; y, 
(x &ge; 2) &or; (x = z) and IsNotNull(x) are valid expressions.    


Given a boolean expression &phi; and a partial function f : V &map; D,
the formula &phi;[f] is obtained by replacing each variable x appearing in &phi; by f(x) if defined,
and by NULL otherwise.
Then the valuation val(&phi;[f]) of &phi;[f] corresponds to the one expected in SQL,
and operators like "=" or &ge; are polymorphic. 
For instance,
for any d &isin; D,
val(d &le; d) = TRUE,
val(d &ne;= d) = FALSE,
val(NULL = d) = UNKNOWN,
val(NULL &le; d) = UNKNOWN,
etc.,


These boolean expressions are explicit RA selection conditions.
Implicit selection conditions (exclusively equality between variables and/or constant) may also be expressed,
for instance by joining two algebraic expressions with shared variables (natural join).


## Leaf node types 

### Data node
Data nodes are prototypical leaf nodes of IQs.
Intuitively,
a data node is similar to a SPARQL triple pattern,
but extended to n-uples.  

Equivalently,
a data node may represent the application to some p &isin; P of a (possibly trivial) selection (&sigma; in RA),
followed by a variable renaming (&rho; in RA).

Internally,
a data node N is characterized (using logical notation) with an expression of the form p(v~1~, .., v~n~),
where p &isin; P,
and each v~i~ is either a constant or a variable,
i.e. v~i~ &isin; D &cup; V.
In addition,
we have var(N) = {v~1~, .., v~n~} &cap; V.


Constants and repeated variable names express selection in the expected way.

For instance,
if N is characterized by p(x,x),
then it represents the RA expression &rho;~[x/p1,x/p2]~ (&sigma;~[p1=p2]~ p).

Therefore,
if I(p) = { {p1 &map; 1, p2 &map; 2}, {p1 &map; 3, p2 &map; 3} },
then ||N|| = { {p1 &map; 3, p2 &map; 3} } will hold.


::: tip Second order queries
SPARQL triple patterns allow for querying over the name of an RDF property,
i.e. the name of a binary predicate. 
In an IQ,
the data node corresponding to such a triple pattern is characterized by a ternary predicate with a meaningless predicate name (currently "triple"),
and the property name variable as first argument.
For instance,
a data node encoding the SPARQL triple pattern ?s ?p ?o (where ?p stands for RDF property names) will be characterized by the expression triple(p,s,o).

This mechanism may be extended in future versions to all predicates.
In other words,
P may be reduced to a set of one predicate per arity ("pair", "triple, "quadruple", etc),
with the current (n-1 ary) predicate names as first argument. 
:::

::: tip Intensional VS extensional data nodes
Todo
:::


### Empty node
An empty node E can be viewed as a specific kind of data node (whether it should be considered as intensional or extensional is not important).
The evaluation of the subquery rooted in E will always be (similar to) the RA n-ary empty relation,
with n &ge; 0.

In other words,
for any database instance,
||E|| = {} holds (although var(E) may be nonempty).

Alternatively,
if var(E) = {v~1~, .., v~n~},
assuming some p &isin; P with arity n,
(the subtree whose only node is) E can be viewed as representing the RA expression &rho;~[v1/p1,..,vn/pn]~ (&sigma;~FALSE~ p).

The behavior of ||E|| as an operand is similar to the behavior of an empty relation in RA.
In particular (see link:nonLeafNodes[the dedicated sections] below for the definitions of the corresponding operators):

* (Left and right) identity element for union: ||E UNION M|| = ||M||,
for any M s.t. var(M) = var(E)
* (Left and right) absorbing element for a natural join: ||E JOIN M|| = ||E||,
for any M
* Left absorbing for left outer join,
and right identity element if there is no join condition,
or if the condition is met (right absorbing otherwise)
* Fixpoint for selection.

### True node
True nodes represent another limit case.
The evaluation of the subquery rooted in a true node T will always be (similar to) the RA nonempty but 0-ary relation.
Or in other words,
var(T) = {},
and for any database instance,
||T|| = {f},
where f has an empty domain.

The behavior of ||T|| as an operand is in most cases similar to the behavior of its RA counterpart.
In particular (see link:nonLeafNodes[the dedicated sections] below for the definitions of the corresponding operators):

* (Left and right) identity element for a natural join: ||T JOIN M|| = ||M||,
for any M
* ||T UNION T|| = ||T|| (see the section about link:bagSemantics[bag semantics] for the treatment of cardinalities in this specific case).  

As expected,
T is also the right identity element for the left outer join operator:

* ||M LEFT JOIN T|| = ||M||,
for any M.

In the case where T is the left operand,
we have: 

* ||T LEFT JOIN M|| = ||M||,
if ||M|| &ne; {} 
* ||T LEFT JOIN M|| = ||T|| otherwise.  

Note that in RA,
because the left outer join operator is traditionally defined in terms of join,
projection,
union and difference,
these two queries would be syntactically invalid (implying a difference and a union of two relations with different arities).
In IQs on the other hand,
the left outer join is viewed as a primitive operator.


## Non-leaf node types

### Inner join node
An inner join node N represents the n-ary natural join of the evaluations of its children nodes,
Explicit joining conditions can also be attached to it,
in the form of a boolean expression &phi;~N~,
as defined above.

It can be defined almost identically to its SPARQL counterpart.
First,
for any two partial functions f and g from V to D,
let f \~ g hold iff for all x &isin; dom(f) &cap; dom(g),
we have f(x) = g(x).

Then algebraic operation represented by an inner join node with explicit joining condition &phi;,
denoted with JOIN~&phi;~,
is defined by:

Then ||N_1 JOIN~&phi;~ N_2|| = { f &cup; g | (f,g) &isin; ||N1|| &times; ||N2|| and f \~ g holds and val(&phi;[f &cup; g]) = TRUE}, 
and V(N_1 JOIN N_2) = v(N1) &cup; v(N2). 


If there is no explicit condition attached to an inner join node,
then it represents the operation N1 JOIN~1=1~ N2,
abbreviated as  N1 JOIN N2.  

### Left join node
A left join node represents the RA binary natural left outer join (or SPARQL OPTIONAL) of the evaluations of its children nodes.
The left and right children nodes respectively stand for the left and right part of the join.

Explicit joining conditions may also be attached to it.

As for join nodes,
this algebraic operation can be defined similarly to its SPARQL counterpart.
An inner join node with explicit joining condition &phi;,
represents the algebraic operation INNER JOIN~&phi;~,
defined by:

||N_1 INNER JOIN~&phi;~ N_2|| = ||N1 JOIN N2|| &cup; { f & isin ||N1|| | for all (g) &isin; ||N2||,
f \~ g or val(&phi;[f &cup; g]) = TRUE does not hold}.

As for join nodes,
if there is no explicit condition attached to an inner join node,
then it represents the operation N1 INNER JOIN~1=1~ N2,
abbreviated as  N1 INNER JOIN N2.  

### Union node
### Construction node
A construction represents a RA extended projection,
followed by an attribute renaming.

"Extended" projection means here that some additional operations on the values of the projected attributes can be expressed,
prototypically string concatenation to create URIs out of data values (but also for instance arithmetic operations).

Attribute renaming is always the second operation,
i.e. it is alway performed on the output of the (extended) projection.

::: tip optional projection and renaming
Both operations (extended projection and renaming) are in a sense optional,
in that the projection with all selected attributes (and no non-trivial additional operation) is the identity operator,
and so is renaming with empty substituion.
So in practice,
a construction node may encode one of these operations.
:::