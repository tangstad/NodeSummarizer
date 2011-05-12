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

var Table = function (textTable) {
    var lines = textTable.split("\n");
    var id, i, row;

    var origLength = lines.length;
    this.data = [];

    for (i=0; i<origLength; i++) {
        row = lines[i].split("\t");
        id = row[1];
        if (id === undefined) {
            continue;
        }
        this.data.push(row);
    }

    this.length = this.data.length;
};

Table.prototype.eachLine = function (f) {
    var line, parent, id, value, i;

    for (i=0; i<this.length; i++) {
        line = this.data[i];

        parent = line[0];
        id = line[1];
        value = line[2];

        f(parent, id, value);
    }
};

Table.prototype.findRoot = function (nodes) {
    var line, parent, id, value, i;

    for (i=0; i<this.length; i++) {
        line = this.data[i];

        parent = line[0];
        id = line[1];
        value = line[2];

        if (parent === "") {
            return nodes[id];
        }
    }
}

Table.prototype.makeNodes = function () {
    var nodes = {};
    var firstLine = true;

    var addNode = function (parent, id, value) {
        if (value) {
            value = value.replace(",", ".");
        }
        nodes[id] = new Tree(parseFloat(value, 10), id);
    };

    var addToParent = function (parent, id, value) {
        if (firstLine) {
            firstLine = false;
            if (isNaN(parseInt(value, 10))) {
                return;
            }
        }
        if (parent !== "") {
            nodes[parent].addChild(nodes[id]);
        }
    };

    this.eachLine(addNode);
    this.eachLine(addToParent);

    return nodes;
};

var parseText = function (text) {
    var nodes;
    var table = new Table(text);

    nodes = table.makeNodes();

    return table.findRoot(nodes);
};

// main function, add row of sums to table of nodes
var addSumsToTable = function (tableText) {
    var table = new Table(tableText);
    var nodes = table.makeNodes();
    var out = [];

    table.eachLine(function(parent, id, value) {
        var sum = commafy(nodes[id].sum());
        out.push([parent, id, value, sum].join("\t"));
    });

    return { output: out.join("\n") };
};

// export to node.js module
if(typeof(exports) !== 'undefined' && exports !== null) {
  exports.Tree = Tree;
  exports.Table = Table;
  exports.parseText = parseText;
  exports.addSumsToTable = addSumsToTable;
}
