var vows = require('vows'),
    assert = require('assert');

var TreeModule = require('./tree');
var addSumsToTable = TreeModule.addSumsToTable;

// utility function to make a table slightly more readable than a tab-delimited list
var makeTable = function (lines) {
    var out = [];
    var i;

    for (i=0; i<lines.length; i++) {
        out.push(lines[i].replace(/ /g, "\t"));
    }
    return out.join("\n");
};
    
vows.describe('Node Summarizer').addBatch({
    'Calculating sub-tree sums': {
        'when input is empty': {
            topic: addSumsToTable(""),

            'should output empty string': function (data) {
                assert.equal(data, "");
            }
        },

        'when we have a single row with integer value': {
            topic: addSumsToTable(makeTable([" root 10"])),

            'should add value as sum of self': function (data) {
                assert.equal(data, makeTable([" root 10 10"]));
            }
        },

        'when we have two rows with integer values': {
            topic: addSumsToTable(makeTable([" root 10",
                                             "root child 15"])),

            'add sum to both rows to parent': function (data) {
                assert.equal(data, makeTable([" root 10 25",
                                              "root child 15 15"]));
            }
        }
    }
}).run();
