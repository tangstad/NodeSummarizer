var vows = require('vows'),
    assert = require('assert');

var TreeModule = require('./tree');
var addSumsToTable = TreeModule.addSumsToTable;
    
vows.describe('Node Summarizer').addBatch({
    'Calculating sub-tree sums': {
        'when input is empty': {
            topic: addSumsToTable(""),

            'should output empty string': function (data) {
                assert.equal(data, "");
            }
        }
    }
}).run();
