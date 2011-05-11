var vows = require('vows'),
    assert = require('assert');

var TreeModule = require('./tree');
var Tree = TreeModule.Tree;
var parseText = TreeModule.parseText;
    
vows.describe('Node Summarizer').addBatch({
    'A tree node': {
        'when single': {
            topic: new Tree(125, 1),
        
            'should have a value': function (tree) {
                assert.equal(tree.value, 125);
            },
        
            'should have an id': function (tree) {
                assert.equal(tree.id, 1);
            },
        
            'should have no children': function (tree) {
                assert.length(tree.getChildren(), 0);
            },
        
            'should have the same sub-tree sum as its own value': function (tree) {
                assert.equal(tree.sum(), 125);
            },
            
            'should have id, value and sum as string representation': function (tree) {
                assert.equal(tree.to_s(), "\t1\t125\t125");
            },

            'should output own details to list': function (tree) {
                var out = [];
                tree.addDetails(out);
                assert.deepEqual(out, [tree.to_s()]);
            },

            'and asked for list of all nodes': {
                topic: function (tree) {
                    return { nodes: tree.getNodes(),
                             tree: tree };
                },

                'should return itself, keyed with id': function (topic) {
                    assert.deepEqual(topic.nodes, { 1: topic.tree });
                }
            }
        },

        'when it has a decimal value': {
            topic: new Tree(120.5, 1),

            'should use comma as decimal delimiter in value and sum in string representation': function (tree) {
                assert.equal(tree.to_s(), "\t1\t120,5\t120,5");
            },
        },
            
        'when made with different id': {
            topic: new Tree(125, 25),
        
            'should have proper id set': function (tree) {
                assert.equal(tree.id, 25);
            }
        },

        'when it has a child': {
            topic: function () {
                var child = new Tree(10, 2);
                var parent = new Tree(20, 1);
                parent.addChild(child);
                return parent;
            },
        
            'should have child in list of children': function (parent) {
                var list = parent.getChildren();
                assert.length(list, 1);
                assert.equal(list[0].value, 10);
            },
        
            'should calculate sum from values of self and child': function (parent) {
                assert.equal(parent.sum(), 10+20);
            },
            
            'should put details of self and child in list': function (parent) {
                var out = [];
                parent.addDetails(out);
                assert.length(out, 2);
                assert.include(out, "1\t2\t10\t10");
                assert.include(out, "\t1\t20\t30");
            },

            'and asked for list of all nodes': {
                topic: function (parent) {
                    return { nodes: parent.getNodes(),
                             parent: parent };
                },

                'should return itself, keyed with id': function (topic) {
                    var child = topic.parent.getChildren()[0];
                    assert.deepEqual(topic.nodes, { 1: topic.parent,
                                                    2: child });
                }
            }
        },
    
        'when it has multiple children': {
            topic: function () {
                var child1 = new Tree(10, 11);
                var child2 = new Tree(20, 12);
                var parent = new Tree(30, 10);
                parent.addChild(child1);
                parent.addChild(child2);
                return parent;
            },
        
            'should calculate sum from self and all children': function (parent) {
                assert.equal(parent.sum(), 10+20+30);
            },
            
            'should put details of self and all children in list': function (parent) {
                var out = [];
                parent.addDetails(out);
                assert.length(out, 3);
                assert.include(out, "\t10\t30\t60");
                assert.include(out, "10\t11\t10\t10");
                assert.include(out, "10\t12\t20\t20");
            },

            'and asked for list of all nodes': {
                topic: function (parent) {
                    return { nodes: parent.getNodes(),
                             parent: parent };
                },

                'should return itself, keyed with id': function (topic) {
                    var child1 = topic.parent.getChildren()[0];
                    var child2 = topic.parent.getChildren()[1];
                    assert.deepEqual(topic.nodes, { 10: topic.parent,
                                                    11: child1,
                                                    12: child2 });
                }
            }
        }
    },
    
    'Text parser': {
        'with empty string': {
            topic: parseText(""),
        
            'should give empty result': function (root) {
                assert.isUndefined(root);
            }
        },

        'with header containing no numbers': {
            topic: parseText("some\theader\ttext"),

            'should ignore header and return empty result': function (root) {
                assert.isUndefined(root);
            }
        },
    
        'with single root node': {
            topic: parseText("\t1\t15"),
        
            'should return node': function (root) {
                assert.equal(root.value, 15);
                assert.equal(root.id, 1);
            }
        },

        'with parent and child nodes': {
            topic: parseText("\t1\t20\n1\t2\t35"),

            'should give parent with child added': function (root) {
                var child = root.getChildren()[0];
                assert.equal(child.value, 35);
                assert.equal(child.id, 2);
            },
            
            'should allow parent to calculate sum': function (root) {
                assert.equal(root.sum(), 20+35);
            }
        },
        
        'with period style decimal point in parent/child values': {
            topic: parseText("\t1\t10.5\n1\t2\t11.5"),
            
            'should be able to calculate sum': function (root) {
                assert.equal(root.sum(), 22);
            }
        },

        'with comma style decimal point in parent/child values': {
            topic: parseText("\t1\t10,5\n1\t2\t11,5"),
            
            'should be able to calculate sum': function (root) {
                assert.equal(root.sum(), 22);
            }
        },

        'with parent and child nodes in reverse order and id': {
            topic: parseText("2\t1\t35\n\t2\t20"),

            'should still give parent with child set': function (root) {
                var child = root.getChildren()[0];
                assert.equal(child.value, 35);
            }
        },
        
        'with extra line at end': {
            topic: parseText("\t1\t15\n"),

            'should ignore extra empty line': function (root) {
                assert.length(root.getChildren(), 0);
            }
        },
    
        'with extra line in the middle': {
            topic: parseText("1\t2\t35\n\n\t1\t20"),

            'should ignore extra empty line': function (root) {
                var child = root.getChildren()[0];
                assert.length(root.getChildren(), 1);
                assert.length(child.getChildren(), 0);
            }
        }
    }
}).run();
