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

// export to node.js module
if(typeof(exports) !== 'undefined' && exports !== null) {
  exports.Tree = Tree;
}