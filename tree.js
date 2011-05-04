var Tree = function (value) {
    this.value = value;
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

// Create object of all nodes based on tab-delimited text
var parseText = function(text) {
    if (text == "") {
        return {};    
    }
    else {
        var list = text.split("\t");
        var id = list[1];
        var value = list[2];
        var nodes = {};
        nodes[id] = new Tree(value);
        return nodes;
    }
};

// export to node.js module
if(typeof(exports) !== 'undefined' && exports !== null) {
  exports.Tree = Tree;
  exports.parseText = parseText;
}