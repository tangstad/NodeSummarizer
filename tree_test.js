// Lower level tests

var vows = require('vows'),
    assert = require('assert');

var TreeModule = require('./tree');
var Tree = TreeModule.Tree;
var Table = TreeModule.Table;
var parseText = TreeModule.parseText;
    
vows.describe('Node Summarizer').addBatch({
    'A tree node': {
        'when single': {
            topic: new Tree(125, 1),
        
            'should have a value': function (tree) {
                assert.equal(tree.value, 125);
            },
        
            'should have an id': function (tree) {
                assert.equal(tree.id, 1);
            },
        
            'should have no children': function (tree) {
                assert.length(tree.getChildren(), 0);
            },
        
            'should have the same sub-tree sum as its own value': function (tree) {
                assert.equal(tree.sum(), 125);
            },
        },

        'when made with different id': {
            topic: new Tree(125, 25),
        
            'should have proper id set': function (tree) {
                assert.equal(tree.id, 25);
            }
        },

        'when it has a child': {
            topic: function () {
                var child = new Tree(10, 2);
                var parent = new Tree(20, 1);
                parent.addChild(child);
                return parent;
            },
        
            'should have child in list of children': function (parent) {
                var list = parent.getChildren();
                assert.length(list, 1);
                assert.equal(list[0].value, 10);
            },
        
            'should calculate sum from values of self and child': function (parent) {
                assert.equal(parent.sum(), 10+20);
            }
        },
    
        'when it has multiple children': {
            topic: function () {
                var child1 = new Tree(10, 11);
                var child2 = new Tree(20, 12);
                var parent = new Tree(30, 10);
                parent.addChild(child1);
                parent.addChild(child2);
                return parent;
            },
        
            'should calculate sum from self and all children': function (parent) {
                assert.equal(parent.sum(), 10+20+30);
            }
        }
    },

    'Table': {
        'with empty input': {
            topic: new Table(""),

            'should have no nodes': function (table) {
                assert.deepEqual(table.makeNodes(), {});
            }
        }
    }
}).run();
