var TinyGui = (function() {
    var types = {
        boolean: createCheck, string: createField,
        number: createRange, function: createButton
    };
    return function (target, title, properties) {
        var form = dom('div', 'tiny-gui').appendTo(document.body);
        form.appendChild(dom('div', 'form-title').text(title));
        properties.forEach(function(props) {
            var type = typeof target[props.name];
            return types[type](props, target, form);
        });
    };

    function createCheck(props, target, form) {
        var checkField = dom('div', 'field check').appendTo(form);
        var check = dom('input').appendTo(checkField);
        check.onchange = function () {
            target[props.name] = check.checked;
        };
        check.setAttribute('type', 'checkbox');
    }

    function createField(props, target, form) {
        var textField = dom('div', 'field text').appendTo(form);
        var text = dom('input').appendTo(textField);
        text.onkeyup = function () {
            target[props.name] = text.value;
        };
        text.setAttribute('placeholder', props.title);
        text.value = target[props.name] || '';
    }

    function createRange(props, target, form) {
        var rangeField = dom('div', 'field range').appendTo(form);
        var text = dom('div', 'text').appendTo(rangeField);
        var indicator = dom('div', 'indicator').appendTo(rangeField);
        var knob = dom('div', 'knob').appendTo(rangeField);
        knob.addEventListener('mousedown', start);
        knob.addEventListener('touchstart', start);
        text.style.width = rangeField.offsetWidth + 'px';
        text.text(props.title + ': ' + (target[props.name]).toFixed(props.fixed || 0));
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
            text.text(props.title + ': ' + val.toFixed(props.fixed || 0));
            target[props.name] = val;
        }

        function up() {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', up);
        }
    }

    function createButton(props, target, form) {
        var button = dom('div', 'field button').text(props.title).appendTo(form);
        button.onclick = target[props.name];
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