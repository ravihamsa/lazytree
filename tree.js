(function (window) {
    "use strict";

    var document = window.document;
    var nodeIndex = {};

    var contentTemplate = "<div class='node-content'><a href='#' class='expand'></a>{name}</div>";
    var noChildTemplate = "<div class='node-content no-child'>{name}</div>";

    var buildNodeIndex = function (node) {
        nodeIndex[node.id] = node;

        var children = node.children;

        var len = children.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                buildNodeIndex(children[i]);
            }
        }

    };

    var renderTree = function (treeNode, element) {
        var nodeChildren = treeNode.children;
        var ul = document.createElement('ul');
        for (var i = 0, len = nodeChildren.length; i < len; i++) {
            var child = nodeChildren[i];
            var li = document.createElement('li');
            li.setAttribute('class', 'closed');
            li.setAttribute('data-nodeid', child.id);
            if (child.children.length > 0) {
                li.innerHTML = getTemplated(contentTemplate, child);
                //renderTree(child, li); // commented to render on demand
            } else {
                li.innerHTML = getTemplated(noChildTemplate, child);
            }
            ul.appendChild(li);
        }
        treeNode.rendered = true;
        element.appendChild(ul);
    };

    var getTemplated = function (template, data) {
        var regex = /{[^}]*}/gi;
        var vars = template.match(regex);
        var txtArr = template.split(regex);
        var len = txtArr.length;
        var output = [];
        for (var i = 0; i < len; i++) {
            // push split text parts
            output.push(txtArr[i]);
            //get varname like {varname}
            var varName = vars[i];
            if (varName) {
                //trim spaces and {} from varname
                var trimmedVarName = varName.replace(/[{}\s]/gi, '');

                if (data[trimmedVarName] !== null && data[trimmedVarName] !== undefined) {
                    //if data available push data
                    output.push(data[trimmedVarName]);

                } else {
                    //if data not available push template itself;
                    output.push(varName);
                }
            }
        }
        return output.join('');
    };

    window.lazyTree = function (treeData, rootElement) {
        buildNodeIndex(treeData);
        if (typeof rootElement === 'string') {
            rootElement = document.getElementById(rootElement);
        }
        renderTree(treeData, rootElement);
        $(rootElement).on('click', 'a.expand', function (e) {
            e.preventDefault();
            var target = $(e.target);
            var li = target.closest('li');
            li.toggleClass('closed');
            var data = nodeIndex[li.data('nodeid')];
            if (!data.rendered) {
                renderTree(data, li[0]);
            }
        });

    };

})(window);