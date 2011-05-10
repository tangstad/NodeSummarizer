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
        },

        'when we have two rows with integer values': {
            topic: addSumsToTable("\troot\t10\nroot\tchild\t15"),

            'add sum of both rows to parent': function (data) {
                var parentRow = data.split("\n", 1);
                assert.equal(parentRow, "\troot\t10\t25");
            },

            'child should have own value as sum': function (data) {
                var childRow = data.split("\n")[1];
                assert.equal(childRow, "root\tchild\t15\t15");
            }
        }
    }
}).run();
