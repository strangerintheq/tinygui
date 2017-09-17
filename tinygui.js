var TinyGui = (function() {
    var types = {
        boolean: createCheck, string: createField,
        number: createRange, function: createButton
    };
    return function (title) {
        document.addEventListener('touchstart', function(e) {e.preventDefault()}, false);
        document.addEventListener('touchmove', function(e) {e.preventDefault()}, false);
        var form = dom('div', 'tiny-gui').appendTo(document.body);
        form.appendChild(dom('div', 'form-title').text(title));
        form.add = function (target, name) {
            var type = typeof target[name];
            return types[type](name, target, form);
        };
        return form;
    };

    function createCheck(name, target, form) {
        var checkField = dom('div', 'field check').appendTo(form);
        var check = dom('input').appendTo(checkField);
        check.onchange = function () {
            target[name] = check.checked;
        };
        check.setAttribute('type', 'checkbox');
    }

    function createField(name, target, form) {
        var textField = dom('div', 'field text').appendTo(form);
        var text = dom('input').appendTo(textField);
        text.onkeyup = function () {
            target[name] = text.value;
        };
        text.setAttribute('placeholder', name);
        text.value = target[name] || '';
    }

    function createRange(name, target, form) {
        var rangeField = dom('div', 'field range').appendTo(form);
        var text = dom('div', 'text').appendTo(rangeField);
        var indicator = dom('div', 'indicator').appendTo(rangeField);
        var knob = dom('div', 'knob').appendTo(rangeField);
        var props = {
            min: -1, max: 1, fixed: 0
        };
        knob.addEventListener('mousedown', start);
        knob.addEventListener('touchstart', start);
        text.style.width = rangeField.offsetWidth + 'px';
        text.text(name + ': ' + (target[name]).toFixed(props.fixed));
        var value = (rangeField.offsetWidth - knob.offsetWidth)*(target[props.name]-props.min);
        indicator.style.width = (knob.offsetWidth + value/(props.max - props.min)) + 'px';
        knob.style.left = value/(props.max - props.min) + 'px';
        return rangeField;

        function start(e) {
            knob.dragStartMouse = e.x || e.touches[0].clientX;
            knob.dragStartOffset = knob.offsetLeft;
            window.addEventListener('mousemove', move);
            window.addEventListener('touchmove', move);
            window.addEventListener('mouseup', up);
            window.addEventListener('touchend', up);
        }

        function move(e) {
            var x = e.x || e.touches[0].clientX;
            var newLeft = knob.dragStartOffset + (x - knob.dragStartMouse);
            newLeft = newLeft < 0 ? 0 : newLeft;
            var full = rangeField.offsetWidth - knob.offsetWidth;
            newLeft = newLeft > full ? full : newLeft;
            knob.style.left = newLeft + 'px';
            indicator.style.width = (knob.offsetWidth + newLeft) + 'px';
            var val = props.min + (props.max - props.min)*newLeft/full;
            text.text(name + ': ' + val.toFixed(props.fixed));
            target[name] = val;
        }

        function up() {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', up);
        }
    }

    function createButton(name, target, form) {
        var button = dom('div', 'field button').text(name).appendTo(form);
        button.onclick = target[name];
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