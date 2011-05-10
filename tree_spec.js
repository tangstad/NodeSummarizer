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
        },

        'when we have a single row with integer value': {
            topic: addSumsToTable("\troot\t10"),

            'should add value as sum of self': function (data) {
                assert.equal(data, "\troot\t10\t10");
            }
        }
    }
}).run();
