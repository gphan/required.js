(function () {
    /*
        {
            reqs: [
                {
                    deps: ['a', 'b'],
                    fn: function (a, b) {}
                }
            ],
            val: value
        }
    */

    /*
     * The module definitions
     */
    var definitions = {},

        isArray = function (val) {
            return Object.prototype.toString.call(val) === '[object Array]';
        },

        /*
         * Checks if dependencies are satisfied
         */
        satisfied = function (deps) {
            if (isArray(deps)) {
                for (var i = 0; i < deps.length; ++i) {
                    if (!definitions.hasOwnProperty(deps[i]) || !definitions[deps[i]].val) {
                        return false;
                    }
                }
            } else {
                if (!definitions.hasOwnProperty(deps) || !definitions[deps].val) {
                        return false;
                }
            }

            return true;
        },

        /*
         * Returns an array of the modules given the dependencies
         */
        modules = function (deps) {
            if (isArray(deps)) {
                var mods = [];

                for (var i = 0; i < deps.length; ++i) {
                    mods.push(definitions[deps[i]].val);
                }

                return mods;
            } else {
                return [definitions[deps].val];
            }
        },

        /*
         * Define a new module
         */
        define = function (name, value) {
            if (!definitions.hasOwnProperty(name)) {
                definitions[name] = {
                    reqs: [],
                    val: value
                };
            } else {
                // Set the value and then check for requires and execute them if they are satisfied
                definitions[name].val = value;

                for (var i = 0; i < definitions[name].reqs.length; ++i) {
                    var req = definitions[name].reqs[i];
                    if (satisfied(req.deps)) {
                        var mods = modules(req.deps);

                        req.fn.apply(req.fn, mods);
                    }
                }
            }
        },

        /*
         * Executes the function when dependencies are satisfied.
         */
        require = function (deps, fn) {
            if (satisfied(deps)) {
                fn.apply(fn, modules(deps));
            } else if (isArray(deps)) {
                for (var i = 0; i < deps.length; ++i) {
                    if (!definitions.hasOwnProperty(deps[i])) {
                        definitions[deps[i]] = {
                            reqs: [
                                {
                                    deps: deps,
                                    fn: fn
                                }
                            ]
                        };
                    } else {
                        definitions[deps[i]].reqs.push({
                            deps: deps,
                            fn: fn
                        });
                    }
                }
            } else {
                if (!definitions.hasOwnProperty(deps)) {
                    definitions[deps] = {
                        reqs: [
                            {
                                deps: deps,
                                fn: fn
                            }
                        ]
                    };
                } else {
                    definitions[deps].reqs.push({
                        deps: deps,
                        fn: fn
                    });
                }
            }
        };

    window.require = require;
    window.define = define;
})();