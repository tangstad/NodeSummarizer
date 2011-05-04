var Tree = function (value) {
    this.value = value;
};

Tree.prototype.getParent = function () {
    return undefined;
};

// export to node.js module
if(typeof(exports) !== 'undefined' && exports !== null) {
  exports.Tree = Tree;
}