/*! 2015-09-24 -- CLIMachs Roll20 Command Framework (v0.0.1) -- See https://github.com/DigitalMachinist/CLIMachs.git for the full source code. */
"use strict";

function _inherits(a, b) {
    if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function, not " + typeof b);
    a.prototype = Object.create(b && b.prototype, {
        constructor: {
            value: a,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b);
}

function _classCallCheck(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
}

var _get = function(a, b, c) {
    for (var d = !0; d; ) {
        var e = a, f = b, g = c;
        h = j = i = void 0, d = !1, null === e && (e = Function.prototype);
        var h = Object.getOwnPropertyDescriptor(e, f);
        if (void 0 !== h) {
            if ("value" in h) return h.value;
            var i = h.get;
            return void 0 === i ? void 0 : i.call(g);
        }
        var j = Object.getPrototypeOf(e);
        if (null === j) return void 0;
        a = j, b = f, c = g, d = !0;
    }
}, _createClass = function() {
    function a(a, b) {
        for (var c = 0; c < b.length; c++) {
            var d = b[c];
            d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
        }
    }
    return function(b, c, d) {
        return c && a(b.prototype, c), d && a(b, d), b;
    };
}(), CLIMachs = {
    collections: {},
    errors: {},
    fn: {},
    state: {}
};

CLIMachs.collections.Callback = function() {
    function a(b, c) {
        if (_classCallCheck(this, a), "function" != typeof c) throw new CLIMachs.type.ArgumentError("fn must be a valid function!");
        if ("string" != typeof b) throw new CLIMachs.type.ArgumentError("key must be a valid string!");
        if (!/['"]/g.test(b)) throw new CLIMachs.type.ArgumentError("key must not contain any single-quotes or double-quotes!");
        this.__fn = c, this.__key = b;
    }
    return _createClass(a, [ {
        key: "fn",
        get: function() {
            return this.__fn;
        }
    }, {
        key: "key",
        get: function() {
            return this.__key;
        }
    } ]), a;
}(), CLIMachs.collections.UniqueCollection = function() {
    function a() {
        var b = arguments.length <= 0 || void 0 === arguments[0] ? null : arguments[0];
        if (_classCallCheck(this, a), null !== b && "function" != typeof b) throw new CLIMachs.errors.ArgumentError("sortingFunction must be a valid function!");
        this.__data = [], this.__sortingFunction = b;
    }
    return _createClass(a, [ {
        key: "add",
        value: function(a) {
            var b = arguments.length <= 1 || void 0 === arguments[1] ? -1 : arguments[1];
            if ("object" != typeof a) throw new CLIMachs.errors.ArgumentError("item must be a valid object!");
            if (!a.key) throw new CLIMachs.errors.ArgumentError("item must have a key property!");
            if ("number" != typeof b) throw new CLIMachs.errors.ArgumentError("index must be a valid number!");
            if (-1 > b || b >= this.__data.length) throw new CLIMachs.errors.ArgumentError("index out of range!");
            var c = this.__data.findIndex(a);
            if (c > -1) throw new CLIMachs.errors.ConflictError("An item already exists with a value of " + (a.key + "."));
            -1 === b ? this.__data.splice(b, 0, a) : this.__data.push(a), this.__sortingFunction && this.__data.sort(this.__sortingFunction);
        }
    }, {
        key: "remove",
        value: function(a) {
            var b = this.__data.findIndex(a);
            if (0 > b) throw new CLIMachs.errors.NotFoundError("No item could be found with a value of" + (a + "."));
            return this.__data.splice(b, 1);
        }
    }, {
        key: "data",
        get: function() {
            return this.__data.slice();
        }
    }, {
        key: "sortingFunction",
        get: function() {
            return this.__sortingFunction;
        },
        set: function(a) {
            if (null !== a && "function" != typeof a) throw new CLIMachs.errors.ArgumentError("sortingFunction must be a valid function!");
            this.__sortingFunction = a;
        }
    } ]), a;
}(), CLIMachs.collections.UniqueKeyedCollection = function(a) {
    function b(a) {
        var c = arguments.length <= 1 || void 0 === arguments[1] ? null : arguments[1];
        if (_classCallCheck(this, b), "string" != typeof a) throw new CLIMachs.errors.ArgumentError("keyProperty must be a valid string!");
        _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, c), this.__keyProperty = a;
    }
    return _inherits(b, a), _createClass(b, [ {
        key: "add",
        value: function(a) {
            var b = this, c = arguments.length <= 1 || void 0 === arguments[1] ? -1 : arguments[1];
            if ("object" != typeof a) throw new CLIMachs.errors.ArgumentError("item must be a valid object!");
            if ("undefined" != typeof a[this.__keyProperty]) throw new CLIMachs.errors.ArgumentError("item must have a " + this.__keyProperty + "property!");
            if ("number" != typeof c) throw new CLIMachs.errors.ArgumentError("index must be a valid number!");
            if (-1 > c || c >= this.__data.length) throw new CLIMachs.errors.ArgumentError("index out of range!");
            var d = this.__data.filter(function(c) {
                return c[b.__keyProperty] === a[b.__keyProperty];
            });
            if (d.length > 0) throw new CLIMachs.errors.ConflictError("An item already exists with a unique key" + ("of " + a[this.__keyProperty] + "."));
            -1 === c ? this.__data.splice(c, 0, a) : this.__data.push(a), this.__sortingFunction && this.__data.sort(this.__sortingFunction);
        }
    }, {
        key: "remove",
        value: function(a) {
            var b = this, c = this.__data.map(function(a, c) {
                return {
                    key: a[b.__keyProperty],
                    index: c
                };
            }).filter(function(c) {
                return c[b.__keyProperty] === a;
            });
            if (0 === c.length) throw new CLIMachs.errors.NotFoundError("No item could be found with a unique key" + ("of " + a + "."));
            return this.__data.splice(c[0].index, 1);
        }
    }, {
        key: "keyProperty",
        get: function() {
            return this.__keyProperty;
        }
    } ]), b;
}(CLIMachs.collections.UniqueCollection), CLIMachs.errors.ArgumentError = function(a) {
    function b(a) {
        _classCallCheck(this, b), _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, a);
    }
    return _inherits(b, a), b;
}(Error), CLIMachs.errors.ConflictError = function(a) {
    function b(a) {
        _classCallCheck(this, b), _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, a);
    }
    return _inherits(b, a), b;
}(Error), CLIMachs.errors.DependencyError = function(a) {
    function b(a) {
        _classCallCheck(this, b), _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, a);
    }
    return _inherits(b, a), b;
}(Error), CLIMachs.errors.NotFoundError = function(a) {
    function b(a) {
        _classCallCheck(this, b), _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, a);
    }
    return _inherits(b, a), b;
}(Error), CLIMachs.fn.currySortAlphabetical = function() {
    var a = arguments.length <= 0 || void 0 === arguments[0] ? !1 : arguments[0];
    return function(b, c) {
        var d = a ? b : b.toLowerCase(), e = a ? c : c.toLowerCase();
        return e > d ? -1 : d > e ? 1 : 0;
    };
}, CLIMachs.fn.currySortAlphabeticalByKey = function(a) {
    var b = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1];
    if ("string" != typeof a) throw new CLIMachs.errors.ArgumentError("sortKey must be a valid string!");
    return function(c, d) {
        var e = b ? c[a] : c[a].toLowerCase(), f = b ? d[a] : d[a].toLowerCase();
        return f > e ? -1 : e > f ? 1 : 0;
    };
}, CLIMachs.fn.getPlayerIdByName = function(a) {
    var b = findObjs({
        type: "player",
        displayname: a
    }, {
        caseInsensitive: !0
    });
    if (b && b.length > 0) return b[0].get("id");
    var c = findObjs({
        type: "character",
        name: a
    }, {
        caseInsensitive: !0
    });
    if (c && c.length > 0) {
        var d = c[0].get("controlledby");
        if (d.length > 0) return d[0];
    }
    return -1;
}, CLIMachs.fn.htmlEscape = function(a) {
    if ("string" != typeof a) throw new CLIMachs.errors.ArgumentError("text must be a valid string!");
    return a.replace(/\n/g, "<br />").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}, CLIMachs.errors.CommandError = function(a) {
    function b(a) {
        _classCallCheck(this, b), _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, a);
    }
    return _inherits(b, a), b;
}(Error), CLIMachs.cli = {}, CLIMachs.cli.CommandPermissions = function() {
    function a(b) {
        if (_classCallCheck(this, a), !(b instanceof CLIMachs.cli.Command)) throw new CLIMachs.errors.ArgumentError("command must be a valid Command object!");
        this.__command = b, this.__groups = new CLIMachs.collections.UniqueCollection(CLIMachs.fn.currySortAlphabetical()), 
        this.__players = new CLIMachs.collections.UniqueCollection(CLIMachs.fn.currySortAlphabetical());
    }
    return _createClass(a, [ {
        key: "addGroup",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.errors.ArgumentError("groupName must be a valid string!");
            var b = CLIMachs.__state.permissionGroups.find(a);
            if (!b) throw new CLIMachs.errors.NotFoundError("No permission group exists by that name!");
            try {
                this.__groups.add(a);
            } catch (c) {
                throw c instanceof CLIMachs.error.ConflictError && (c.message = 'The "' + a + '" group already has permission to execute the ' + ('"' + this.__command.fullSignature + '" command, so it cannot be added.')), 
                c;
            }
            return this;
        }
    }, {
        key: "addPlayer",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.errors.ArgumentError("playerName must be a valid string!");
            var b = CLIMachs.fn.getPlayerIdByName(a);
            if (0 > b) throw new CLIMachs.errors.NotFoundError("No player exists by that name" + ("(" + a + ")."));
            try {
                this.__players.add(b);
            } catch (c) {
                throw c instanceof CLIMachs.errors.ConflictError && (c.message = a + " already has permission to execute the " + ('"' + this.__command.fullSignature + '" command, so they cannot be added.')), 
                c;
            }
            return this;
        }
    }, {
        key: "removeGroup",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.errors.ArgumentError("groupName must be a valid string!");
            try {
                this.__groups.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.errors.NotFoundError && (b.message = 'The "' + a + "\" doesn't have permission to execute the " + ('"' + this.__command.fullSignature + '" command, so it cannot be removed.')), 
                b;
            }
            return this;
        }
    }, {
        key: "removePlayer",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.errors.ArgumentError("playerName must be a valid string!");
            var b = CLIMachs.fn.getPlayerIdByName(a);
            if (0 > b) throw new CLIMachs.errors.NotFoundError("No player exists by that name" + ("(" + a + ")."));
            try {
                this.__players.remove(b);
            } catch (c) {
                throw c instanceof CLIMachs.errors.NotFoundError && (c.message = a + " doesn't have permission to execute the " + ('"' + this.__command.fullSignature + '" command, so they cannot be removed.')), 
                c;
            }
            return this;
        }
    }, {
        key: "test",
        value: function(a) {
            if (!a || "api" !== a.type) throw new CLIMachs.errors.ArgumentError("message must be a valid Roll20 Message!");
            return playerIsGM(a.playerid) ? !0 : this.players.find(a.playerid) ? !0 : this.groups.data.map(function(a) {
                return CLIMachs.__state.permissionGroups[a];
            }).filter(function(a) {
                return !!a;
            }).reduce(function(b, c) {
                return b || c.fn(a);
            }, !1);
        }
    }, {
        key: "command",
        get: function() {
            return this.__command;
        }
    }, {
        key: "groups",
        get: function() {
            return this.__groups.data;
        }
    }, {
        key: "players",
        get: function() {
            return this.__players.data;
        }
    } ]), a;
}(), CLIMachs.cli.CommandResponse = function() {
    function a(b, c) {
        var d = arguments.length <= 2 || void 0 === arguments[2] ? "self" : arguments[2], e = arguments.length <= 3 || void 0 === arguments[3] ? "" : arguments[3], f = arguments.length <= 4 || void 0 === arguments[4] ? "CLIMachs" : arguments[4];
        if (_classCallCheck(this, a), !b || "api" !== b.type) throw new CLIMachs.errors.ArgumentError("message must be a valid Roll20 chat message!");
        if ("string" != typeof d) throw new CLIMachs.errors.ArgumentError("recipient must be a valid string!");
        if ("string" != typeof f) throw new CLIMachs.errors.ArgumentError("speaker must be a valid string!");
        if ("string" != typeof e) throw new CLIMachs.errors.ArgumentError("style must be a valid string!");
        if ("string" != typeof c && !(c instanceof Array)) throw new CLIMachs.errors.ArgumentError("text must be a valid string or Array!");
        this.__message = b, this.__recipient = d, this.__speaker = f, this.__style = e, this.__text = c;
    }
    return _createClass(a, [ {
        key: "message",
        get: function() {
            return this.__message;
        }
    }, {
        key: "recipient",
        get: function() {
            return this.__recipient;
        },
        set: function(a) {
            if ("string" != typeof recipient) throw new CLIMachs.errors.ArgumentError("recipient must be a valid string!");
            this.__recipient = a;
        }
    }, {
        key: "speaker",
        get: function() {
            return this.__speaker;
        },
        set: function(a) {
            if ("string" != typeof speaker) throw new CLIMachs.errors.ArgumentError("speaker must be a valid string or Array!");
            this.__speaker = a;
        }
    }, {
        key: "style",
        get: function() {
            return this.__style;
        },
        set: function(a) {
            if ("string" != typeof style) throw new CLIMachs.errors.ArgumentError("style must be a valid string!");
            this.__style = a;
        }
    }, {
        key: "text",
        get: function() {
            return this.__text;
        },
        set: function(a) {
            if ("string" != typeof a && !(a instanceof Array)) throw new CLIMachs.errors.ArgumentError("text must be a valid string or Array!");
            this.__text = a;
        }
    } ]), a;
}(), CLIMachs.cli.Command = function() {
    function a(b, c, d, e) {
        if (_classCallCheck(this, a), "function" != typeof e) throw new CLIMachs.errors.ArgumentError("callback must be a valid function!");
        if ("string" != typeof c) throw new CLIMachs.errors.ArgumentError("description must be a valid string!");
        if ("string" != typeof b) throw new CLIMachs.errors.ArgumentError("signature must be a valid string!");
        if (!/['"]/g.test(b)) throw new CLIMachs.errors.ArgumentError("signature must not contain any single-quotes or double-quotes!");
        if ("string" != typeof d) throw new CLIMachs.errors.ArgumentError("syntax must be a valid string!");
        this.__aliases = new CLIMachs.collections.UniqueCollection(CLIMachs.fn.currySortAlphabetical()), this.__callback = e, 
        this.__description = c, this.__parent = null, this.__permissions = new CLIMachs.cli.CommandPermissions(), 
        this.__signature = b, this.__subcommands = new CLIMachs.collections.UniqueKeyedCollection("signature", CLIMachs.fn.currySortAlphabeticalByKey("signature")), 
        this.__syntax = d;
    }
    return _createClass(a, [ {
        key: "addAlias",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.errors.ArgumentError("alias must be a valid string!");
            if (!/['"]/g.test(a)) throw new CLIMachs.errors.ArgumentError("alias must not contain any single-quotes or double-quotes!");
            try {
                this.__aliases.add(a);
            } catch (b) {
                throw b instanceof CLIMachs.errors.ConflictError && (b.message = "The " + a + " alias already exists, so it cannot be added."), 
                b;
            }
            return this;
        }
    }, {
        key: "addSubcommand",
        value: function(a) {
            if (!(a instanceof CLIMachs.cli.Command)) throw new CLIMachs.errors.ArgumentError("command must be a valid Command object!");
            var b = this.__subcommands.map(function(a) {
                return a.allAliases;
            }).reduce(function(a, b) {
                return a.concat(b);
            }, []).filter(function(b) {
                return a.allAliases.find(b);
            }).sort(CLIMachs.fn.currySortAlphabetical());
            if (b.length > 0) throw new CLIMachs.errors.ConflictError('The "' + a.signature + '" subcommandcollides with some existing command signatures/aliases, so it cannot be added!Commands: ' + b);
            a.parent = this;
            try {
                this.__subcommands.add(a);
            } catch (c) {
                throw c instanceof CLIMachs.errors.ConflictError && (c.message = 'The "' + a.signature + '" subcommand already exists, so it cannot be added.'), 
                c;
            }
            return this;
        }
    }, {
        key: "execute",
        value: function(a, b) {
            if (!this.__permissions.test(b)) throw new CLIMachs.errors.CommandError("You do not have permission to execute the requsted command.");
            return this.callback(arguments, b);
        }
    }, {
        key: "removeAlias",
        value: function(a) {
            try {
                this.__aliases.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.errors.NotFoundError && (b.message = "The " + a + " alias could not be found, so it cannot be removed."), 
                b;
            }
            return !0;
        }
    }, {
        key: "removeSubcommand",
        value: function(a) {
            try {
                this.__subcommands.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.errors.NotFoundError && (b.message = "The " + a + " subcommand could not be found, so it cannot be removed."), 
                b;
            }
            return !0;
        }
    }, {
        key: "aliases",
        get: function() {
            return this.__aliases.data;
        }
    }, {
        key: "callback",
        get: function() {
            return this.__callback;
        }
    }, {
        key: "description",
        get: function() {
            return this.__description;
        }
    }, {
        key: "parent",
        get: function() {
            return this.__parent;
        },
        set: function(a) {
            if (!(a instanceof CLIMachs.cli.Command)) throw new CLIMachs.errors.ArgumentError("parent must be a valid Command object!");
            this.__parent = a;
        }
    }, {
        key: "permissions",
        get: function() {
            return this.__permissions;
        }
    }, {
        key: "signature",
        get: function() {
            return this.__signature;
        }
    }, {
        key: "subcommands",
        get: function() {
            return this.__subcommands.data;
        }
    }, {
        key: "syntax",
        get: function() {
            return this.__syntax;
        }
    }, {
        key: "allAliases",
        get: function() {
            return this.__aliases.concat(this.__signature).sort(CLIMachs.fn.currySortAlphabetical());
        }
    }, {
        key: "fullSignature",
        get: function() {
            return this.__fullSignatureTokens.join(" ");
        }
    }, {
        key: "fullSignatureTokens",
        get: function() {
            var a = [ this.__signature ];
            return this.__parent && a.unshift(this.__parent.fullSignature), a;
        }
    } ]), a;
}(), CLIMachs.cli.CLI = function() {
    function a() {
        _classCallCheck(this, a), this.__commands = new CLIMachs.collections.UniqueKeyedCollection("signature", CLIMachs.fn.currySortAlphabeticalByKey("signature")), 
        this.__permissionGroups = new CLIMachs.collections.UniqueKeyedCollection("key", CLIMachs.fn.currySortAlphabeticalByKey("key")), 
        this.__preCommandMiddleware = new CLIMachs.collections.UniqueKeyedCollection("key", null), this.__preResponseMiddleware = new CLIMachs.collections.UniqueKeyedCollection("key", null), 
        this.__preRoutingMiddleware = new CLIMachs.collections.UniqueKeyedCollection("key", null);
    }
    return _createClass(a, [ {
        key: "addCommand",
        value: function(a) {
            if (!(a instanceof CLIMachs.cli.Command)) throw new CLIMachs.errors.ArgumentError("command must be a valid Command object!");
            var b = this.__commands.map(function(a) {
                return a.allAliases;
            }).reduce(function(a, b) {
                return a.concat(b);
            }, []).filter(function(b) {
                return a.allAliases.find(b);
            }).sort(CLIMachs.fn.currySortAlphabetical());
            if (b.length > 0) throw new CLIMachs.errors.ConflictError("The " + a.signature + " command collideswith existing command signatures/aliases, so it cannot be added! Commands: " + b);
            a.parent = null;
            try {
                this.__commands.add(a);
            } catch (c) {
                throw c instanceof CLIMachs.errors.ConflictError && (c.message = 'The "' + a.signature + '" subcommand already exists, so it cannot be added.'), 
                c;
            }
            return this;
        }
    }, {
        key: "addPermissionGroup",
        value: function(a, b) {
            try {
                var c = new CLIMachs.collections.Callback(a, b);
                this.__permissionGroups.add(c);
            } catch (d) {
                throw d instanceof CLIMachs.errors.ConflictError && (d.message = 'The "' + a + '" permission group already exists, so it cannot be added.'), 
                d;
            }
            return this;
        }
    }, {
        key: "addPreCommandMiddleware",
        value: function(a, b) {
            var c = arguments.length <= 2 || void 0 === arguments[2] ? -1 : arguments[2];
            try {
                var d = new CLIMachs.collections.Callback(a, b);
                this.__preCommandMiddleware.add(d, c);
            } catch (e) {
                throw e instanceof CLIMachs.errors.ConflictError && (e.message = 'The "' + a + '" pre-command middleware already exists, so it cannot be added.'), 
                e;
            }
            return this;
        }
    }, {
        key: "addPreResponseMiddleware",
        value: function(a, b) {
            var c = arguments.length <= 2 || void 0 === arguments[2] ? -1 : arguments[2];
            try {
                var d = new CLIMachs.collections.Callback(a, b);
                this.__preResponseMiddleware.add(d, c);
            } catch (e) {
                throw e instanceof CLIMachs.errors.ConflictError && (e.message = 'The "' + a + '" pre-response middleware already exists, so it cannot be added.'), 
                e;
            }
            return this;
        }
    }, {
        key: "addPreRoutingMiddleware",
        value: function(a, b) {
            var c = arguments.length <= 2 || void 0 === arguments[2] ? -1 : arguments[2];
            try {
                var d = new CLIMachs.collections.Callback(a, b);
                this.__preRoutingMiddleware.add(d, c);
            } catch (e) {
                throw e instanceof CLIMachs.errors.ConflictError && (e.message = 'The "' + a + '" pre-routing middleware already exists, so it cannot be added.'), 
                e;
            }
            return this;
        }
    }, {
        key: "evaluate",
        value: function(a) {
            var b = null;
            try {
                if (!a || "api" !== a.type) throw new CLIMachs.errors.ArgumentError("message must be a Roll20 API chat message!");
                b = this.route(this.tokenize(a.contents), a);
            } catch (c) {
                c instanceof CLIMachs.errors.CommandError ? b = new CLIMachs.cli.CommandResponse(a, c.message, "self") : (log(c), 
                b = new CLIMachs.cli.CommandResponse(a, "An unexpected error occurred! See the script execution log.", "self"));
            }
            return b;
        }
    }, {
        key: "removeCommand",
        value: function(a) {
            try {
                this.__commands.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.errors.NotFoundError && (b.message = "The " + a + " command could not be found, so it cannot be removed."), 
                b;
            }
            return this;
        }
    }, {
        key: "removePermissionGroup",
        value: function(a) {
            var b = this.allCommands.filter(function(b) {
                return b.permissions.groups.find(a);
            });
            if (b.length > 0) throw new CLIMachs.errors.DependencyError("The " + a + " permission group cannotnot be removed because one or more commands depend upon it. Commands:" + b);
            try {
                this.__permissionGroups.remove(a);
            } catch (c) {
                throw c instanceof CLIMachs.errors.NotFoundError && (c.message = 'The "' + a + '" group command could not be found, so it cannot be removed.'), 
                c;
            }
            return this;
        }
    }, {
        key: "removePreCommandMiddleware",
        value: function(a) {
            try {
                this.__preCommandMiddleware.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.errors.NotFoundError && (b.message = 'The "' + a + '" pre-command middleware could not be found, so it cannot be removed.'), 
                b;
            }
            return this;
        }
    }, {
        key: "removePreResponseMiddleware",
        value: function(a) {
            try {
                this.__preResponseMiddleware.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.errors.NotFoundError && (b.message = 'The "' + a + '" pre-response middleware could not be found, so it cannot be removed.'), 
                b;
            }
            return this;
        }
    }, {
        key: "removePreRoutingMiddleware",
        value: function(a) {
            try {
                this.__preRoutingMiddleware.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.errors.NotFoundError && (b.message = 'The "' + a + '" pre-routing middleware could not be found, so it cannot be removed.'), 
                b;
            }
            return this;
        }
    }, {
        key: "route",
        value: function(a, b) {
            function c(a, b, c) {
                for (var d = !0; d; ) {
                    var e = a, f = b, g = c;
                    h = i = void 0, d = !1;
                    var h = e.shift(), i = g.filter(function(a) {
                        return a.signature === h;
                    });
                    if (!(i.length > 0)) return f;
                    a = e, b = i[0].subcommands, c = void 0, d = !0;
                }
            }
            if (!(a instanceof Array)) throw new CLIMachs.errors.ArgumentError("tokens must be a valid Array!");
            if (a.length > 0) throw new CLIMachs.errors.ArgumentError("tokens must contain at least one element!");
            if (a.filter(function(a) {
                return "string" != typeof a;
            }) > 0) throw new CLIMachs.errors.ArgumentError("tokens must contain only strings!");
            var d = this.__preRoutingMiddleware.forEach(function(c) {
                return c.callback(a, b);
            }).map(function(c) {
                return c.callback(a, b);
            }).reduce(function(a, b) {
                return a ? a && b : !1;
            }, !0);
            if (!d) throw new Error("Operation aborted by middleware before message routing.");
            var e = c(a, null, this.commands);
            if (!e) throw new CLIMachs.errors.NotFoundError("Command not found.");
            var f = this.__preCommandMiddleware.map(function(c) {
                return c.callback(e, a, b);
            }).reduce(function(a, b) {
                return a ? a && b : !1;
            }, !0);
            if (!f) throw new Error("Operation aborted by middleware before command execution.");
            var g = e.execute(a, b), h = this.__preResponseMiddleware.map(function(a) {
                return a.callback(g, b);
            }).reduce(function(a, b) {
                return a ? a && b : !1;
            }, !0);
            if (!h) throw new Error("Operation aborted by middleware before response.");
            return g;
        }
    }, {
        key: "sendResponse",
        value: function(a) {
            var b = "";
            switch (a.recipient) {
              case "all":
                break;

              case "gm":
                b = "/w gm";
                break;

              case "self":
                b = "/w " + a.message.who;
                break;

              default:
                b = "/w " + a.recipient;
            }
            var c = "padding: 0; margin: 0; white-space: pre-wrap; " + a.style, d = [].concat(a.text).map(function(a) {
                return "<p>" + CLIMachs.fn.htmlEscape(a) + "</p>";
            });
            sendChat(b + ' <div style="' + c + ">" + d + '</div>"', a.speaker);
        }
    }, {
        key: "tokenize",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.errors.ArgumentError("messageContents must be a valid string!");
            return a.match(/([^ '"]+|'.*?'|".*?")/g).map(function(a) {
                return a.replace(/^['"]/g, "");
            }).map(function(a) {
                return a.replace(/['"]$/g, "");
            });
        }
    }, {
        key: "onChatMessage",
        value: function(a) {
            var b = this, c = this.evaulate(a), d = void 0;
            if (c instanceof CLIMachs.cli.CommandResponse) try {
                this.sendResponse(c);
            } catch (e) {
                d = "A response could not be sent to chat: " + c;
            } else c instanceof Array ? c.forEach(function(a) {
                try {
                    b.sendResponse(a);
                } catch (c) {
                    d = "A response could not be sent to chat: " + a;
                }
            }) : d = "A command must return a CommandResponse or an Array of CommandResponses! Response: " + c;
            d && (log(d), sendChat());
        }
    }, {
        key: "onReady",
        value: function() {
            on("chat:message", this.onChatMessage);
        }
    }, {
        key: "commands",
        get: function() {
            return this.__commands.data;
        }
    }, {
        key: "permissionGroups",
        get: function() {
            return this.__permissionGroups.data;
        }
    }, {
        key: "preCommandMiddleware",
        get: function() {
            return this.__preCommandMiddleware.data;
        }
    }, {
        key: "preResponseMiddleware",
        get: function() {
            return this.__preResponseMiddleware.data;
        }
    }, {
        key: "preRoutingMiddleware",
        get: function() {
            return this.__preRoutingMiddleware.data;
        }
    }, {
        key: "allCommands",
        get: function() {
            function a(b, c) {
                return c.reduce(function(b, c) {
                    return b.concat(a(b, c.subcommands));
                });
            }
            return a([], this.__commands);
        }
    } ]), a;
}(), function() {
    CLIMachs.state = new CLIMachs.cli.CLI(), on("ready", CLIMachs.state.onReady);
}();