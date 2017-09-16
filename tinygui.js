var TinyGui = (function() {

    var types = {
        boolean: createCheck,
        string: createField,
        number: createRange,
        function: createButton
    };

    return function (target, title, properties) {
        var form = dom('div', 'tiny-gui');
        form.appendChild(dom('div', 'form-title').text(title));
        properties.forEach(function(props) {
            var type = typeof target[props.name];
            return types[type](props, target).appendTo(form);
        });
        return form;
    };

    function createCheck(props, target) {
        return dom('input');
    }

    function createField(props, target) {
        return dom('input');
    }

    function createRange(props, target) {
        return dom('input');
    }

    function createButton(props, target) {
        return dom('input');
    }

    function dom(name, className) {
        var element = document.createElement(name);
        element.className = className;
        element.appendTo = function(parent) {
            return parent.appendChild(element);
        };
        element.text = function (text) {
            element.textContent = text;
            return element;
        };
        return element;
    }
})();