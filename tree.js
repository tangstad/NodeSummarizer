var Tree = function (value, id) {
    this.value = value;
    this.id = id;
    this.children = [];
    this.cached_sum = undefined;
};

Tree.prototype.addChild = function (child) {
    this.children.push(child);
};

Tree.prototype.getChildren = function () {
    return this.children;
};

// get hash of all nodes
Tree.prototype.getNodes = function () {
    var hash = {};
    var key;
    var nodes;
    var i;

    hash[this.id] = this;
    for (i=0; i<this.children.length; i++) {
        nodes = this.children[i].getNodes();
        for (key in nodes) {
            hash[key] = nodes[key];
        }
    }
    return hash;
};

// turn value into string with comma as decimal point
var commafy = function (value) {
    var s = "" + value;
    return s.replace(".", ",");
}

Tree.prototype.to_s = function (parent_id) {
    parent_id = parent_id || "";
    return parent_id + "\t" + this.id + "\t" + commafy(this.value) + "\t" + commafy(this.sum());
};

Tree.prototype.addDetails = function (out, parent_id) {
    var len = this.children.length;
    var i;

    out.push(this.to_s(parent_id));
    for (i=0; i<len; i++) {
        this.children[i].addDetails(out, this.id);
    }
};

// Since we recurse to get all values, the sum is calculated only once, then 
// cached
Tree.prototype.sum = function () {
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

var makeNodes = function (lines) {
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

var connectNodes = function (nodes, lines) {
    var list, id, parent, i, value;
    
    for (i=0; i<lines.length; i++) {
        list = lines[i].split("\t");
        parent = list[0];
        id = list[1];
        if (i === 0) {
            value = list[2];
            if (isNaN(parseInt(value, 10))) {
                continue;
            }
        }
        if (parent !== "") {
            nodes[parent].addChild(nodes[id]);
        }
    }
};

var findRoot = function (nodes, lines) {
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
var parseText = function (text) {
    var nodes = {};
    var lines = text.split("\n");
    nodes = makeNodes(lines);
    connectNodes(nodes, lines);
    return findRoot(nodes, lines);
};

var iterateTable = function (table, f) {
    var data, parent, id, value, i;
    var lines = table.split("\n");

    for (i=0; i<lines.length; i++) {
        data = lines[i].split("\t");
        parent = data[0];
        id = data[1];
        value = data[2];
        f(parent, id, value);
    }
};

// main function, add row of sums to table of nodes
var addSumsToTable = function (table) {
    var root = parseText(table);
    if (root === undefined) {
        return { output: "" };
    }

    var nodes = root.getNodes();
    var out = [];

    iterateTable(table, function(parent, id, value) {
        var sum = commafy(nodes[id].sum());
        out.push([parent, id, value, sum].join("\t"));
    });

    return { output: out.join("\n") };
};

// export to node.js module
if(typeof(exports) !== 'undefined' && exports !== null) {
  exports.Tree = Tree;
  exports.parseText = parseText;
  exports.addSumsToTable = addSumsToTable;
}
