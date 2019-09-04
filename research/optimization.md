# Intermediate query optimization 

::: warning
TODO: UPDATE AND CHECK (2 years old, imported from AsciiDocs)
:::

This section provides a high level description of different transformations which may be applied to [Intermediate Queries](/dev/iq) (_IQs_ in what follows) for optimization purposes.

## Notation
The different types of nodes of an IQ are presented [in the dedicated section](/dev/iq#query-nodes).
The following notation will also be use in the current document.

### (Sub)trees
If s is a tree,
then root(s) will designate its root.

If n is a node in an IQ Q,
then children~Q~(n) (resp. children(n) when Q is obvious from the context) will designate the immediate children of n in Q,
and subtree~Q~(n) (resp. subtree(n)) the maximal subtree of Q rooted in n.
In addition,
a "subtree of Q" will be understood as a maximal subtree of Q rooted in some node of Q.
Finally,
childSubtrees~Q~(n) (resp. childSubtrees(n)) will stand for {subtree~Q~(c) | c &isin; children~Q~(n)}

### Projected variables

If s is a subtree in an IQ,
then var(s) will designate the _variables projected out by s_,
defined inductively as follows:

* If root(s) explicitly projects out variables (construction node,
union node,
data node or empty node),
then var(s) is the set of such variables.

* Otherwise,
var(s) = &#8899; ~s&isin;childSubtrees(n)~ var(s)  

If e is an (explicit) join or filter condition,
then var(e) will designate the variables appearing in e. 


## Propagating down boolean expressions
This optimization is used for (some) NoSQL underlying DBMS.
It consists in transforming an input IQ into an equivalent one such that,
whenever possible,
selections precede other algebraic operations.
Or in other words,
it consists in propagating (explicit) boolean expressions down the algebraic tree.

Three types of IQ nodes support boolean expressions,
namely:

* filter nodes, 
* inner join nodes, and
* left join nodes 

For each node n of one of these types,
if n has an explicit boolean expression e attached to it,
then e is put into DNF,
and each resulting conjunct may be propagated down independently.
For instance,
n may be a filter node,
and e the expression (x > y) &wedge; (y &ne; z).
Then (x > y) and (y &ne; z) may both be propagated down,
independently from each other.
If n is a node of one of the three types just mentioned,
then bool(n) will designate the set of such conjuncts.

### Propagation decision and recipient selection
Propagation decisions are primarily taken based on a comparison between:

* the variables var(e) present in the conjunct e being propagated down,
and
* the variables var(s) projected out by each candidate subtree s for the propagation of e. 

#### Default case (inner join of filter provider node)

Let e &isin; bool(n).
The default rule to decide whether e can be propagated down from n is the following:
for each s &isin; childSubtrees(n),
if var(e) &subseteq; var(s),
then e can be propagated down to s.

An expression e being propagated down a subtree s also needs (a) new recipient node(s) to support it.
The recipients selection procedure is the following:

* if root(s) is neither a union node,
construction node or left join node,
then it is the (only) recipient of e in s.

* Otherwise,
each s' &isin; childSubtrees(root(s)) recursively becomes a new candidate subtree for propagation.
If there no s' &isin; childSubtrees(root(s)) to which e can be propagated down,
then root(s) is the (only) recipient of e in s.
Note that in a valid IQ,
if s is a construction or union node,
then var(s) &subseteq; var(s') must hold for each s' &isin; childSubtrees(root(s)),
therefore var(e) &subseteq; var(s') holds by transitivity,
such that root(s) cannot be the recipient for e in s.
But it may be the case if s is a left join node.
  

Finally,
if a recipient node r for e in s (or s') does not natively supports non-conditional boolean expressions,
i.e. if r is neither a filter nor an inner join node,
then a new filter node is created as the (immediate) parent of r,
in order to support e.
Alternatively (as a form of syntactic sugar),
if the node n initially providing e is the immediate parent of r,
then this new filter node is not needed,
and e can remain attached to n,
which in this case plays the role of "pseudo-recipient" of e in s.

Note that if n is the pseudo-recipient of e in s,
then from the above selection procedure,
root(s) must be a data node,
empty node,
true node,
or a left join node with no child accepting e,
which in all cases guarantees that e cannot be further propagated down s. 



#### Specific case (left join provider node)

The propagation decision and recipient selection procedures are identical for a boolean conjunct e provided by a left join node n,
but with an exception:
e may only be propagated down the subtree rooted in the right child of n.
Indeed,
if e was propagated down the left subtree,
an additional selection would be added to the algebraic expression represented by that left branch,
violating the semantics of conditions attached to a left join (see link:intermediateQuery_detailed.adoc#leftjoinNode[the dedicated section] for an explanation).   


### Duplication decision
Let e &isin; bool(n) for some node n in an IQ Q.
And let us assume that there is at least one s &isin; childSubtrees(n) to which e can be propagated,
and that in each such s,
a proper recipient node for e,
different from n,
has been found (or in other words that n is not the pseudo-recipient of e for any such s).

Then the decision still needs to be taken whether e should remain attached to n,
(i.e. be duplicated down) or not (i.e. be strictly pushed down).

#### Default case 
By default,
an attempt is made to strictly push down e if it can be propagated down to at least one s &isin; childSubtrees(n).
So in the default case,
and provided n is not a pseudo-recipient for e in any s,
e will not remain attached to n. 

#### Specific case (left-join-rooted candidate subtree)
 
If s is a candidate subtree for the propagation of e,
and if a recipient node r in s has been found such that the path in Q from the provider node n of e to r comprises a left join node j and the right child j' of j,
then e will remain attached to the provider node n,
i.e. e will be duplicated down,
instead of strictly pushed down.

This prevents an alteration of the semantic of the IQ.
Consider for instance the following example (where r = j' for simplicity).

::: tip NOTE
Let:

* Q1 be a well-formed IQ
* n1 be a filter node, 
n1 &isin; Q1,
and bool(n1) = {e},
where e is the expression x &lt; 1
* j1 be a left join node with (explicit) joining condition x &le; y,
and such that children(n1) = {j1}
* l1 be the left child of j1,
with var(subtree(l1)) = {y}
* r1 be a filter node and the right child of j1,
with var(subtree(r1)) = {x}

Then r1 is a recipient for e.

Now consider the query Q2 identical to Q1,
where n2 (resp. j2, r2, etc.) is the counterpart of n1 (resp. j1, r1, etc.),
but such that e has been pushed down to r2 (and therefore is not attached to n2 anymore).
And let us assume a database instance defining an evaluation function ||.||,
such that ||l1|| =  { {y &map; 2} } and ||r1|| = { {x &map; 1} }.

Then ||j1|| = { {x &map; 1, y &map; 2} },
and ||n1|| = { {} }.

But ||l2|| = { {y &map; 2} } and ||r2|| = { {} } must also hold,
therefore ||j2|| = { {y &map; 2} } and ||n2|| = { {y &map; 2} },
such that ||n1|| &ne; ||n2||.
:::