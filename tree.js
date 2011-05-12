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

var textTo2dArray = function (textTable) {
    var lines = textTable.split("\n");
    var rows = [];
    var row;

    var isNumber = function (s) {
        s = s.replace(",", ".");
        return (s - 0) == s && s.length > 0;
    };

    var validLine = function(line) {
        var id = line.split("\t")[2];
        return line && isNumber(id);
    };

    for (var i=0, length=lines.length; i<length; i++) {
        if (validLine(lines[i])) {
            row = lines[i].split("\t");
            rows.push(row);
        }
    }
    return rows;
};

var Table = function (textTable) {
    this.rows = textTo2dArray(textTable);
    this.length = this.rows.length;
};

Table.prototype.eachLine = function (f) {
    var line, parent, id, value, i;

    for (i=0; i<this.length; i++) {
        line = this.rows[i];

        parent = line[0];
        id = line[1];
        value = line[2];

        f(parent, id, value);
    }
};

Table.prototype.findRoot = function (nodes) {
    var line, parent, id, value, i;

    for (i=0; i<this.length; i++) {
        line = this.rows[i];

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
  exports.addSumsToTable = addSumsToTable;
}
