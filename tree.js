var Tree = function (value) {
    this.value = value;    
}

// export to node.js module
if(typeof(exports) !== 'undefined' && exports !== null) {
  exports.Tree = Tree;
}