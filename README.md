Required.js
===========

Required.js is a simple dependency requirement framework that does not fetch scripts
but instead waits for possible modules to load to execute a function. If the dependencies are
never satisfied, the function will never be executed.

Compared to require.js
----------------------
* Doesn't asynchronously load files
* Allows you to handle your own minification and grouping
