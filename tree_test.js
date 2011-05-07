var vows = require('vows'),
    assert = require('assert');

var TreeModule = require('./tree');
var Tree = TreeModule.Tree;
var parseText = TreeModule.parseText;

var countNodes = function(nodes) {
    var length = 0;
    var n;
    for (n in nodes){
        length += 1;
    }
    return length;
};
    
vows.describe('Node Summarizer').addBatch({
    'A tree node': {
        'when single': {
            topic: new Tree(125, 1),
        
            'should have a value': function(tree) {
                assert.equal (tree.value, 125);
            },
        
            'should have id set': function(tree) {
                assert.equal (tree.id, 1);
            },
        
            'should have no parent': function(tree) {
                assert.isUndefined (tree.getParent());
            },
        
            'should have sum same as own value': function(tree) {
                assert.equal (tree.sum(), 125);
            }
        },
    
        'when made with different id': {
            topic: new Tree(125, 25),
        
            'should have proper id set': function(tree) {
                assert.equal (tree.id, 25);
            }
        },

        'when it has a child': {
            topic: function() {
                var child = new Tree(10, 2);
                var parent = new Tree(20, 1);
                parent.addChild(child);
                return parent;
            },
        
            'should have child in list of children': function(parent) {
                var list = parent.getChildren();
                assert.length (list, 1);
                assert.equal (list[0].value, 10);
            },
        
            'should have sum of values self and child': function(parent) {
                assert.equal (parent.sum(), 10+20);
            }
        },
    
        'when it has multiple children': {
            topic: function() {
                var child1 = new Tree(10);
                var child2 = new Tree(20);
                var parent = new Tree(30);
                parent.addChild(child1);
                parent.addChild(child2);
                return parent;
            },
        
            'should have sum of self and all children': function(parent) {
                assert.equal (parent.sum(), 10+20+30);
            }
        },
    },
    
    'Text parser': {
        'with empty string': {
            topic: parseText(""),
        
            'should give empty set of nodes': function(nodes) {
                var length = 0;
                var n;
                for (n in nodes){ 
                    length += 1;
                }
                assert.equal (length, 0);
            }
        },
    
        'with single root node': {
            topic: parseText("\t1\t15"),
        
            'should give single node': function(nodes) {
                assert.equal (countNodes(nodes), 1);
            },

            'should give node with value and id parsed': function(nodes) {
                assert.equal (nodes['1'].value, 15);
            }
        },

        'with parent and child nodes': {
            topic: parseText("\t1\t20\n1\t2\t35"),

            'should give two nodes': function(nodes) {
                assert.equal (countNodes(nodes), 2);
            },

            'should give parent with child set': function(nodes) {
                var parent = nodes['1'];
                var child = nodes['2'];
                assert.equal (parent.getChildren()[0], child);
            }
        },

        'with parent and child nodes in reverse order': {
            topic: parseText("1\t2\t35\n\t1\t20"),

            'should give parent with child set': function(nodes) {
                var parent = nodes['1'];
                var child = nodes['2'];
                assert.equal (parent.getChildren()[0], child);
            }
        },
        
        'with extra line at end': {
            topic: parseText("\t1\t15\n"),

            'should ignore extra empty line': function(nodes) {
                assert.equal (countNodes(nodes), 1);
            }
        },
    
        'with extra line in the middle': {
            topic: parseText("1\t2\t35\n\n\t1\t20"),

            'should ignore extra empty line': function(nodes) {
                assert.equal (countNodes(nodes), 2);
            }
        }
    }
}).run();
