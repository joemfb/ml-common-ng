(function($) {
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        closedIcon: '&#x21e2;',
        data: [{"label":"<a href=\"-_ml.common_.html\">'ml.common'</a>","id":"'ml.common'","children":[]},{"label":"<a href=\"MLQueryBuilder.html\">MLQueryBuilder</a>","id":"MLQueryBuilder","children":[]},{"label":"<a href=\"MLRest.html\">MLRest</a>","id":"MLRest","children":[]}],
        openedIcon: ' &#x21e3;',
        saveState: true,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);
