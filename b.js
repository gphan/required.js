require('a', function (a) {
    define('b', function () { alert(a.text); });
    alert('b calling in: ' + a.text);
});