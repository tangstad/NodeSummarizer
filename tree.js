var Tree = function (value, id) {
    this.value = value;
    this.id = id;
    this.children = [];
    this.cached_sum = undefined;
};

Tree.prototype.addChild = function(child) {
    this.children.push(child);
};

Tree.prototype.getChildren = function() {
    return this.children;
};

Tree.prototype.to_s = function(parent_id) {
    parent_id = parent_id || "";
    return parent_id + "\t" + this.id + "\t" + this.value + "\t" + this.sum();
};

Tree.prototype.addDetails = function(out, parent_id) {
    var len = this.children.length;
    var i;

    out.push(this.to_s(parent_id));
    for (i=0; i<len; i++) {
        this.children[i].addDetails(out, this.id);
    }
};

// Since we recurse to get all values, the sum is calculated only once, then 
// cached
Tree.prototype.sum = function() {
    var total = this.value;
    var l = this.children.length;
    var i = 0;
    
    if (this.cached_sum === undefined) {    
        for (; i<l; i++)
        {
            total += this.children[i].sum();
        }
        this.cached_sum = total;
    }
    return this.cached_sum;
};

var makeNodes = function(lines) {
    var list, id, value, i;
    var nodes = {};

    for (i=0; i<lines.length; i++) {
        list = lines[i].split("\t");
        id = list[1];
        value = list[2];
        if (value) {
            value = value.replace(",", ".");
        }
        nodes[id] = new Tree(parseFloat(value, 10), id);
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

var findRoot = function(nodes, lines) {
    var list, id, parent, i;
    
    for (i=0; i<lines.length; i++) {
        if (lines[i] === "") {
            continue;
        }
        list = lines[i].split("\t");
        parent = list[0];
        id = list[1];
        if (parent === "") {
            return nodes[id];
        }
    }    
};

// Create object of all nodes based on tab-delimited text
var parseText = function(text) {
    var nodes = {};
    var lines = text.split("\n");
    nodes = makeNodes(lines);
    connectNodes(nodes, lines);
    return findRoot(nodes, lines);
};

// export to node.js module
if(typeof(exports) !== 'undefined' && exports !== null) {
  exports.Tree = Tree;
  exports.parseText = parseText;
}
