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

Tree.prototype.to_s = function(parent_id) {
    if (parent_id !== undefined) {
        return parent_id + "\t" + this.id + "\t" + this.value + "\t" + this.sum();
    } else {
        return "\t" + this.id + "\t" + this.value + "\t" + this.sum();
    }
};

Tree.prototype.addDetails = function(out, parent_id) {
    out.push(this.to_s(parent_id));
    if (this.children.length > 0) {
        this.children[0].addDetails(out, this.id);
    }
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
    var list, id, value, i;
    var nodes = {};

    for (i=0; i<lines.length; i++) {
        if (lines[i] === "") {
            continue;
        }
        list = lines[i].split("\t");
        id = list[1];
        value = list[2];
        nodes[id] = new Tree(value);
    }
    
    return nodes;
};

var connectNodes = function(nodes, lines) {
    var list, id, parent, i;
    
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
