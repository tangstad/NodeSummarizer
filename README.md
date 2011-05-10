Node Summarizer
===============

Given a tree of nodes with values, we want to calculate the sums of all the
subtrees. The input and output is in a spreadsheet-friendly form where each
line represents one node. Each node has an ID, value and the ID of its parent,
unless it's the one and only root node.

Requirements of input
---------------------

The error handling is still pretty flimsy, so it's pretty strict about the
input following the following format:

* Each line has a tab-delimited set of parent-id, id, value (in that order)
* Both comma and period will be treated as decimal separators in values
* Each parent-id must be the same as id of another node
* One node, and one only, is the root, specified by having an empty parent-id
* No column-headers or extra data is supported

Output format
-------------

The output follows the same format as the input, with an extra column added:

* Each line in the output is a tab-delimited set of parent-id, id, value, sub-tree sum (in that order)
* Comma is used as decimal separator for value and sum
* Order of nodes might change from input
* There is one line in output for each line in input, parent-id, id and value is unmodified (except for decimal separator)

Live test
---------
The code is testable at [the test page](http://tangstad.github.com/NodeSummarizer/).
