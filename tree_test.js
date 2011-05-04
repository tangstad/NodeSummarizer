var vows = require('vows'),
    assert = require('assert');

var TreeModule = require('./tree');
var Tree = TreeModule.Tree
    
vows.describe('Tree').addBatch({
    'when making a new tree node': {
        topic: function() { return new Tree(125); },
        
        'it has a value': function(topic) {
            assert.equal (topic.value, 125);
        }
    }
}).run();