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
                assert.equal(data.output, "");
            }
        },

        'when header contains no numbers': {
            topic: addSumsToTable("some\theader\ttext"),

            'should ignore header and return empty result': function (data) {
                assert.equal(data.output, "");
            }
        },

        'when we have a single row with integer value': {
            topic: addSumsToTable(makeTable([" root 10"])),

            'should add value as sum of self': function (data) {
                assert.equal(data.output, makeTable([" root 10 10"]));
            }
        },

        'when we have two rows with integer values': {
            topic: addSumsToTable(makeTable([" root 10",
                                             "root child 15"])),

            'add sum to both rows to parent': function (data) {
                assert.equal(data.output, makeTable([" root 10 25",
                                              "root child 15 15"]));
            }
        },

        'when we have two rows with child first': {
            topic: addSumsToTable(makeTable(["root child 15",
                                             " root 10"])),

            'add sum to both rows, keeping order': function (data) {
                assert.equal(data.output, makeTable(["root child 15 15",
                                              " root 10 25"]));
            }
        },

        'when we have two children with comma based decimal values': {
            topic: addSumsToTable(makeTable([" root 10,5",
                                             "root child1 15,3",
                                             "root child2 25,4"])),

            'add sum to both rows, keeping order': function (data) {
                assert.equal(data.output, makeTable([" root 10,5 51,2",
                                              "root child1 15,3 15,3",
                                              "root child2 25,4 25,4"]));
            }
        }
    }
}).run();
