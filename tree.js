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
        var lines = text.split("\n");
        var list, id, value, parent, node;
        var nodes = {};
        for (var i=0; i<lines.length; i++) {
            list = lines[i].split("\t");
	    parent = list[0];
            id = list[1];
            value = list[2];
	    node = new Tree(value);
	    if (parent !== "") {
		nodes[parent].addChild(node);
	    }
            nodes[id] = node;;
        };
        return nodes;
    }
};

// export to node.js module
if(typeof(exports) !== 'undefined' && exports !== null) {
  exports.Tree = Tree;
  exports.parseText = parseText;
}
