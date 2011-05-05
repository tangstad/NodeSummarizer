var vows = require('vows'),
    assert = require('assert');

var TreeModule = require('./tree');
var Tree = TreeModule.Tree;
var parseText = TreeModule.parseText;

var countNodes = function(nodes) {
    var length = 0;
    var node;
    var id;
    var n;
    for (n in nodes){
        length += 1;
        id = n;
        node = nodes[n];
    }
    return length;
};
    
vows.describe('Node Summarizer').addBatch({
    'Single tree node': {
        topic: new Tree(125),
        
        'has a value': function(tree) {
            assert.equal (tree.value, 125);
        },
        
        'has no parent': function(tree) {
            assert.isUndefined (tree.getParent());
        },
        
        'sum is same as own value': function(tree) {
            assert.equal (tree.sum(), 125);
        }
    },
    'Child and parent nodes': {
        topic: function() {
            var child = new Tree(10);
            var parent = new Tree(20);
            parent.addChild(child);
            return parent;
        },
        
        'can get list of children': function(parent) {
            var list = parent.getChildren();
            assert.equal (list.length, 1);
            assert.equal (list[0].value, 10);
        },
        
        'sum is sum of self and child': function(parent) {
            assert.equal (parent.sum(), 10+20);
        }
    },
    
    'Node with multiple children': {
        topic: function() {
            var child1 = new Tree(10);
            var child2 = new Tree(20);
            var parent = new Tree(30);
            parent.addChild(child1);
            parent.addChild(child2);
            return parent;
        },
        
        'can get sum of self and all children': function(parent) {
            assert.equal (parent.sum(), 10+20+30);
        }
    },
    
    'Text parser with empty string': {
        topic: parseText(""),
        
        'gives empty set of nodes': function(nodes) {
            var length = 0;
            var n;
            for (n in nodes){ 
                length += 1;
            }
            assert.equal (length, 0);
        }
    },
    
    'Text parser with single root node': {
        topic: parseText("\t1\t15"),
        
        'gives single node': function(nodes) {
            assert.equal (countNodes(nodes), 1);
        },

	'has correct node': function(nodes) {
            assert.equal (nodes['1'].value, 15);
	}
    },

    'Text parser with parent and child nodes': {
        topic: parseText("\t1\t20\n1\t2\t35"),

        'gives two nodes': function(nodes) {
            assert.equal (countNodes(nodes), 2);
        },

	'has right relationship': function(nodes) {
	    var parent = nodes['1'];
	    var child = nodes['2'];
	    assert.equal (parent.getChildren()[0], child);
	}
    },

    'Text parser with parent and child nodes in reverse order': {
        topic: parseText("1\t2\t35\n\t1\t20"),

	'has right relationship': function(nodes) {
	    var parent = nodes['1'];
	    var child = nodes['2'];
	    assert.equal (parent.getChildren()[0], child);
	}
    }
}).run();
