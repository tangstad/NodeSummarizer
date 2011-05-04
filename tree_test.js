var vows = require('vows'),
    assert = require('assert');

var TreeModule = require('./tree');
var Tree = TreeModule.Tree;
    
vows.describe('Node Summarizer').addBatch({
    'Single tree node': {
        topic: new Tree(125),
        
        'has a value': function(tree) {
            assert.equal (tree.value, 125);
        },
        
        'has no parent': function(tree) {
            assert.isUndefined (tree.getParent());
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
        }
    }
}).run();