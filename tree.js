var Tree = function (value, id) {
    this.value = value;
    this.id = id;
    this.children = [];
};

Tree.prototype.getParent = function () {
    return undefined;
};

Tree.prototype.addChild = function(child) {
    this.children.push(child);
};

Tree.prototype.getChildren = function() {
    return this.children;
};

// Unless called from the root node, this can get pretty inefficient as it 
// will recalculate all children at each call.
Tree.prototype.sum = function() {
    var total = this.value;
    var l = this.children.length;
    var i = 0;
    
    for (; i<l; i++)
    {
        total += this.children[i].sum();
    }
    return total;
};

var makeNodes = function(lines) {
    var list, id, value, parent, node, i;
    var nodes = {};

    for (i=0; i<lines.length; i++) {
        if (lines[i] === "") {
            continue;
        }
        list = lines[i].split("\t");
        id = list[1];
        value = list[2];
        node = new Tree(value);
        nodes[id] = node;
    }
    
    return nodes;
};

var connectNodes = function(nodes, lines) {
    var list, id, value, parent, node, i;
    for (i=0; i<lines.length; i++) {
        list = lines[i].split("\t");
        parent = list[0];
        id = list[1];
        if (parent !== "") {
            nodes[parent].addChild(nodes[id]);
        }
    }
};

// Create object of all nodes based on tab-delimited text
var parseText = function(text) {
    var nodes = {};

    if (text !== "") {
        var lines = text.split("\n");
        nodes = makeNodes(lines);
        connectNodes(nodes, lines);
    }
    
    return nodes;
};

// export to node.js module
if(typeof(exports) !== 'undefined' && exports !== null) {
  exports.Tree = Tree;
  exports.parseText = parseText;
}
