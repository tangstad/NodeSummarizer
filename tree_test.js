var vows = require('vows'),
    assert = require('assert');

var TreeModule = require('./tree');
var Tree = TreeModule.Tree;
    
vows.describe('Node Summarizer').addBatch({
    'Single tree node': {
        topic: new Tree(125),
        
        'has a value': function(tree) {
            assert.equal (tree.value, 125);
        }
    }
}).run();