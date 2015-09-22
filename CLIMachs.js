/*! 2015-09-22 -- CLIMachs Roll20 Command Framework (v0.0.1) -- See https://github.com/DigitalMachinist/roll20-cypher-system.git for the full source code. */
"use strict";

function _classCallCheck(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
}

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

var _createClass = function() {
    function a(a, b) {
        for (var c = 0; c < b.length; c++) {
            var d = b[c];
            d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
        }
    }
    return function(b, c, d) {
        return c && a(b.prototype, c), d && a(b, d), b;
    };
}(), _get = function(a, b, c) {
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
}, CLIMachs = CLIMachs || {
    type: {
        ArgumentError: function(a) {
            function b(a) {
                _classCallCheck(this, b), _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, a);
            }
            return _inherits(b, a), b;
        }(Error),
        Callback: function() {
            function a(b, c) {
                if (_classCallCheck(this, a), "function" != typeof c) throw new CLIMachs.type.ArgumentError("fn must be a valid function!");
                if ("string" != typeof b) throw new CLIMachs.type.ArgumentError("key must be a valid string!");
                if (!/['"]/g.test(b)) throw new CLIMachs.type.ArgumentError("key must not contain any single-quotes or double-quotes!");
                this.fn = c, this.key = b;
            }
            return _createClass(a, [ {
                key: "fn",
                get: function() {
                    return this.fn;
                }
            }, {
                key: "key",
                get: function() {
                    return this.key;
                }
            } ]), a;
        }(),
        ConflictError: function(a) {
            function b(a) {
                _classCallCheck(this, b), _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, a);
            }
            return _inherits(b, a), b;
        }(Error),
        DependencyError: function(a) {
            function b(a) {
                _classCallCheck(this, b), _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, a);
            }
            return _inherits(b, a), b;
        }(Error),
        NotFoundError: function(a) {
            function b(a) {
                _classCallCheck(this, b), _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, a);
            }
            return _inherits(b, a), b;
        }(Error),
        UniqueCollection: function() {
            function a() {
                var b = arguments.length <= 0 || void 0 === arguments[0] ? null : arguments[0];
                if (_classCallCheck(this, a), null !== b || "function" != typeof b) throw new CLIMachs.type.ArgumentError("sortingFunction must be a valid function!");
                this.data = [], this.sortingFunction = b;
            }
            return _createClass(a, [ {
                key: "add",
                value: function(a) {
                    var b = arguments.length <= 1 || void 0 === arguments[1] ? -1 : arguments[1];
                    if ("object" != typeof a) throw new CLIMachs.type.ArgumentError("item must be a valid object!");
                    if (!a.key) throw new CLIMachs.type.ArgumentError("item must have a key property!");
                    if ("number" != typeof b) throw new CLIMachs.type.ArgumentError("index must be a valid number!");
                    if (-1 > b || b >= this.data.length) throw new CLIMachs.type.ArgumentError("index out of range!");
                    var c = this.data.findIndex(a);
                    if (c > -1) throw new CLIMachs.type.ConflictError("An item already exists with a value of " + (a.key + "."));
                    -1 === b ? this.data.splice(b, 0, a) : this.data.push(a), this.sortingFunction && this.data.sort(this.sortingFunction);
                }
            }, {
                key: "remove",
                value: function(a) {
                    var b = this.data.findIndex(a);
                    if (0 > b) throw new CLIMachs.type.NotFoundError("No item could be found with a value of" + (a + "."));
                    return this.data.splice(b, 1);
                }
            }, {
                key: "data",
                get: function() {
                    return this.data.slice();
                }
            }, {
                key: "sortingFunction",
                get: function() {
                    return this.sortingFunction;
                },
                set: function(a) {
                    if (null !== a || "function" != typeof a) throw new CLIMachs.type.ArgumentError("sortingFunction must be a valid function!");
                    this.sortingFunction = a;
                }
            } ]), a;
        }(),
        UniqueKeyedCollection: function(a) {
            function b(a) {
                var c = arguments.length <= 1 || void 0 === arguments[1] ? null : arguments[1];
                if (_classCallCheck(this, b), "string" != typeof a) throw new CLIMachs.type.ArgumentError("keyProperty must be a valid string!");
                _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, c), this.keyProp = a;
            }
            return _inherits(b, a), _createClass(b, [ {
                key: "add",
                value: function(a) {
                    var b = this, c = arguments.length <= 1 || void 0 === arguments[1] ? -1 : arguments[1];
                    if ("object" != typeof a) throw new CLIMachs.type.ArgumentError("item must be a valid object!");
                    if ("undefined" != typeof a[this.keyProperty]) throw new CLIMachs.type.ArgumentError("item must have a " + this.keyProp + "property!");
                    if ("number" != typeof c) throw new CLIMachs.type.ArgumentError("index must be a valid number!");
                    if (-1 > c || c >= this.data.length) throw new CLIMachs.type.ArgumentError("index out of range!");
                    var d = this.data.filter(function(c) {
                        return c[b.keyProp] === a[b.keyProp];
                    });
                    if (d.length > 0) throw new CLIMachs.type.ConflictError("An item already exists with a unique key" + ("of " + a[this.keyProp] + "."));
                    -1 === c ? this.data.splice(c, 0, a) : this.data.push(a), this.sortingFunction && this.data.sort(this.sortingFunction);
                }
            }, {
                key: "remove",
                value: function(a) {
                    var b = this, c = this.data.map(function(a, c) {
                        return {
                            key: a[b.keyProp],
                            index: c
                        };
                    }).filter(function(c) {
                        return c[b.keyProp] === a;
                    });
                    if (0 === c.length) throw new CLIMachs.type.NotFoundError("No item could be found with a unique key" + ("of " + a + "."));
                    return this.data.splice(c[0].index, 1);
                }
            }, {
                key: "keyProp",
                get: function() {
                    return this.keyProp;
                }
            } ]), b;
        }(CLIMachs.type.UniqueCollection)
    },
    fn: {
        currySortAlphabetical: function() {
            var a = arguments.length <= 0 || void 0 === arguments[0] ? !1 : arguments[0];
            return function(b, c) {
                var d = a ? b : b.toLowerCase(), e = a ? c : c.toLowerCase();
                return e > d ? -1 : d > e ? 1 : 0;
            };
        },
        currySortAlphabeticalByKey: function(a) {
            var b = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1];
            return function(c, d) {
                var e = b ? c[a] : c[a].toLowerCase(), f = b ? d[a] : d[a].toLowerCase();
                return f > e ? -1 : e > f ? 1 : 0;
            };
        },
        getPlayerIdByName: function(a) {
            var b = findObjs({
                type: "player",
                displayname: a
            }, {
                caseInsensitive: !0
            });
            if (b && b.length > 0) return b[0].id;
            var c = findObjs({
                type: "character",
                name: a
            }, {
                caseInsensitive: !0
            });
            return c && c.length > 0 && c.controlledby.length > 0 ? c[0].controlledby[0].id : -1;
        },
        htmlEscape: function(a) {
            return String(a).replace(/\n/g, "<br />").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        },
        htmlUnescape: function(a) {
            return String(a).replace(/<br \/>/g, "\n").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        }
    }
};

CLIMachs.type.CommandError = function(a) {
    function b(a) {
        _classCallCheck(this, b), _get(Object.getPrototypeOf(b.prototype), "constructor", this).call(this, a);
    }
    return _inherits(b, a), b;
}(Error), CLIMachs.type.CommandPermissions = function() {
    function a(b) {
        if (_classCallCheck(this, a), !(b instanceof CLIMachs.type.Command)) throw new CLIMachs.type.ArgumentError("command must be a valid Command object!");
        this.command = b, this.groups = new CLIMachs.type.UniqueKeyedCollection("key", CLIMachs.fn.currySortAlphabeticalByKey("key")), 
        this.players = new CLIMachs.type.UniqueCollection(CLIMachs.fn.currySortAlphabetical());
    }
    return _createClass(a, [ {
        key: "addGroup",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.type.ArgumentError("groupName must be a valid string!");
            var b = CLIMachs.cli.permissionGroups.find(function(b) {
                return b.key === a;
            });
            if (!b) throw new CLIMachs.type.CommandError("No permission group exists by that name!");
            var c = CLIMachs.type.Callback(a, b.callback);
            try {
                this.groups.add(c);
            } catch (d) {
                throw d instanceof CLIMachs.type.ConflictError && (d.message = 'The "' + a + '" group already has permission to execute the ' + ('"' + this.command.fullSignature + '" command, so it cannot be added.')), 
                d;
            }
            return this;
        }
    }, {
        key: "addPlayer",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.type.ArgumentError("playerName must be a valid string!");
            var b = CLIMachs.fn.getPlayerIdByName(a);
            if (0 > b) throw new CLIMachs.type.CommandError("No player exists by that name (" + a + ").");
            try {
                this.players.add(b);
            } catch (c) {
                throw c instanceof CLIMachs.type.ConflictError && (c.message = a + " already has permission to execute the " + ('"' + this.command.fullSignature + '" command, so they cannot be added.')), 
                c;
            }
            return this;
        }
    }, {
        key: "removeGroup",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.type.ArgumentError("groupName must be a valid string!");
            var b = CLIMachs.cli.permissionGroups.find(function(b) {
                return b.key === a;
            });
            if (!b) throw new CLIMachs.type.CommandError("No permission group exists by that name " + ("(" + a + ")."));
            try {
                this.groups.remove(a);
            } catch (c) {
                throw c instanceof CLIMachs.type.NotFoundError && (c.message = 'The "' + a + "\" doesn't have permission to execute the " + ('"' + this.command.fullSignature + '" command, so it cannot be removed.')), 
                c;
            }
            return this;
        }
    }, {
        key: "removePlayer",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.type.ArgumentError("playerName must be a valid string!");
            var b = CLIMachs.fn.getPlayerIdByName(a);
            if (0 > b) throw new CLIMachs.type.NotFoundError("No player exists by that name (" + a + ").");
            try {
                this.players.remove(b);
            } catch (c) {
                throw c instanceof CLIMachs.type.NotFoundError && (c.message = a + " doesn't have permission to execute the " + ('"' + this.command.fullSignature + '" command, so they cannot be removed.')), 
                c;
            }
            return this;
        }
    }, {
        key: "test",
        value: function(a) {
            if (!a || "api" !== a.type) throw new CLIMachs.type.ArgumentError("message must be a valid Roll20 Message!");
            return playerIsGM(a.playerid) ? !0 : this.players.find(a.playerid) ? !0 : this.groups.reduce(function(b, c) {
                return b = b || c.fn(a);
            }, !1);
        }
    }, {
        key: "command",
        get: function() {
            return this.command;
        }
    }, {
        key: "groups",
        get: function() {
            return this.groups.data;
        }
    }, {
        key: "players",
        get: function() {
            return this.players.data;
        }
    } ]), a;
}(), CLIMachs.type.CommandResponse = function() {
    function a(b, c, d) {
        var e = arguments.length <= 3 || void 0 === arguments[3] ? "" : arguments[3], f = arguments.length <= 4 || void 0 === arguments[4] ? "CLIMachs" : arguments[4];
        if (_classCallCheck(this, a), !b || "api" !== b.type) throw new CLIMachs.type.ArgumentError("message must be a valid Roll20 chat message!");
        if ("string" != typeof d) throw new CLIMachs.type.ArgumentError("recipient must be a valid string!");
        if ("string" != typeof f) throw new CLIMachs.type.ArgumentError("speaker must be a valid string!");
        if ("string" != typeof e) throw new CLIMachs.type.ArgumentError("style must be a valid string!");
        if ("string" != typeof c && !(c instanceof Array)) throw new CLIMachs.type.ArgumentError("text must be a valid string or Array!");
        this.message = b, this.recipient = d, this.speaker = f, this.style = e, this.text = c;
    }
    return _createClass(a, [ {
        key: "message",
        get: function() {
            return this.message;
        }
    }, {
        key: "recipient",
        get: function() {
            return this.recipient;
        },
        set: function(a) {
            if ("string" != typeof recipient) throw new CLIMachs.type.ArgumentError("recipient must be a valid string!");
            this.recipient = a;
        }
    }, {
        key: "speaker",
        get: function() {
            return this.speaker;
        },
        set: function(a) {
            if ("string" != typeof speaker) throw new CLIMachs.type.ArgumentError("speaker must be a valid string or Array!");
            this.speaker = a;
        }
    }, {
        key: "style",
        get: function() {
            return this.style;
        },
        set: function(a) {
            if ("string" != typeof style) throw new CLIMachs.type.ArgumentError("style must be a valid string!");
            this.style = a;
        }
    }, {
        key: "text",
        get: function() {
            return this.text;
        },
        set: function(a) {
            if ("string" != typeof a && !(a instanceof Array)) throw new CLIMachs.type.ArgumentError("text must be a valid string or Array!");
            this.text = a;
        }
    } ]), a;
}(), CLIMachs.type.Command = function() {
    function a(b, c, d, e) {
        if (_classCallCheck(this, a), "function" != typeof e) throw new CLIMachs.type.ArgumentError("callback must be a valid function!");
        if ("string" != typeof c) throw new CLIMachs.type.ArgumentError("description must be a valid string!");
        if ("string" != typeof b) throw new CLIMachs.type.ArgumentError("signature must be a valid string!");
        if (!/['"]/g.test(b)) throw new CLIMachs.type.ArgumentError("signature must not contain any single-quotes or double-quotes!");
        if ("string" != typeof d) throw new CLIMachs.type.ArgumentError("syntax must be a valid string!");
        this.aliases = new CLIMachs.type.UniqueCollection(CLIMachs.fn.currySortAlphabetical()), this.callback = e, 
        this.description = c, this.parent = null, this.permissions = new CLIMachs.type.CommandPermissions(), 
        this.signature = b, this.subcommands = new CLIMachs.type.UniqueKeyedCollection("signature", CLIMachs.fn.currySortAlphabeticalByKey("signature")), 
        this.syntax = d;
    }
    return _createClass(a, [ {
        key: "addAlias",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.type.ArgumentError("alias must be a valid string!");
            if (!/['"]/g.test(a)) throw new CLIMachs.type.ArgumentError("alias must not contain any single-quotes or double-quotes!");
            try {
                this.aliases.add(a);
            } catch (b) {
                throw b instanceof CLIMachs.type.ConflictError && (b.message = "The " + a + " alias already exists, so it cannot be added."), 
                b;
            }
            return this;
        }
    }, {
        key: "addSubcommand",
        value: function(a) {
            if (!(a instanceof CLIMachs.type.Command)) throw new CLIMachs.type.ArgumentError("command must be a valid Command object!");
            var b = this.subcommands.map(function(a) {
                return a.allAliases;
            }).reduce(function(a, b) {
                return a.concat(b);
            }, []).filter(function(b) {
                return a.allAliases.find(b);
            }).sort(CLIMachs.fn.currySortAlphabetical());
            if (b.length > 0) throw new CLIMachs.type.ConflictError('The "' + a.signature + '" subcommand collideswith some existing command signatures/aliases, so it cannot be added! Commands: ' + b);
            a.parent = this;
            try {
                this.subcommands.add(a);
            } catch (c) {
                throw c instanceof CLIMachs.type.ConflictError && (c.message = 'The "' + a.signature + '" subcommand already exists, so it cannot be added.'), 
                c;
            }
            return this;
        }
    }, {
        key: "execute",
        value: function(a, b) {
            if (!this.permissions.test(b)) throw new CLIMachs.test.CommandError("You do not have permission to execute the requsted command.");
            return this.callback(arguments, b);
        }
    }, {
        key: "removeAlias",
        value: function(a) {
            try {
                this.aliases.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.type.NotFoundError && (b.message = "The " + a + " alias could not be found, so it cannot be removed."), 
                b;
            }
            return !0;
        }
    }, {
        key: "removeSubcommand",
        value: function(a) {
            try {
                this.subcommands.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.type.NotFoundError && (b.message = "The " + a + " subcommand could not be found, so it cannot be removed."), 
                b;
            }
            return !0;
        }
    }, {
        key: "aliases",
        get: function() {
            return this.aliases.data;
        }
    }, {
        key: "callback",
        get: function() {
            return this.callback;
        }
    }, {
        key: "description",
        get: function() {
            return this.description;
        }
    }, {
        key: "parent",
        get: function() {
            return this.parent;
        },
        set: function(a) {
            if (!(a instanceof CLIMachs.type.Command)) throw new CLIMachs.type.ArgumentError("parent must be a valid Command object!");
            this.parent = a;
        }
    }, {
        key: "permissions",
        get: function() {
            return this.permissions;
        }
    }, {
        key: "signature",
        get: function() {
            return this.signature;
        }
    }, {
        key: "subcommands",
        get: function() {
            return this.subcommands.data;
        }
    }, {
        key: "syntax",
        get: function() {
            return this.syntax;
        }
    }, {
        key: "allAliases",
        get: function() {
            return this.aliases.concat(this.signature).sort(CLIMachs.fn.currySortAlphabetical());
        }
    }, {
        key: "fullSignature",
        get: function() {
            return this.fullSignatureTokens.join(" ");
        }
    }, {
        key: "fullSignatureTokens",
        get: function() {
            var a = [ this.signature ];
            return this.parent && a.unshift(this.parent.fullSignature), a;
        }
    } ]), a;
}(), CLIMachs.type.CLI = function() {
    function a() {
        _classCallCheck(this, a), this.commands = new CLIMachs.type.UniqueKeyCollection("signature", CLIMachs.fn.currySortAlphabeticalByKey("signature")), 
        this.permissionGroups = new CLIMachs.type.UniqueKeyCollection("key", CLIMachs.fn.currySortAlphabeticalByKey("key")), 
        this.preCommandMiddleware = new CLIMachs.type.UniqueKeyCollection("key", null), this.preResponseMiddleware = new CLIMachs.type.UniqueKeyCollection("key", null), 
        this.preRoutingMiddleware = new CLIMachs.type.UniqueKeyCollection("key", null);
    }
    return _createClass(a, [ {
        key: "addCommand",
        value: function(a) {
            if (!(a instanceof CLIMachs.type.Command)) throw new CLIMachs.type.ArgumentError("command must be a valid Command object!");
            var b = this.commands.map(function(a) {
                return a.allAliases;
            }).reduce(function(a, b) {
                return a.concat(b);
            }, []).filter(function(b) {
                return a.allAliases.find(b);
            }).sort(CLIMachs.fn.currySortAlphabetical());
            if (b.length > 0) throw new CLIMachs.type.ConflictError("The " + a.signature + " command collideswith existing command signatures/aliases, so it cannot be added! Commands: " + b);
            a.parent = null;
            try {
                this.commands.add(a);
            } catch (c) {
                throw c instanceof CLIMachs.type.ConflictError && (c.message = 'The "' + a.signature + '" subcommand already exists, so it cannot be added.'), 
                c;
            }
            return this;
        }
    }, {
        key: "addPermissionGroup",
        value: function(a, b) {
            try {
                var c = new CLIMachs.type.Callback(a, b);
                this.permissionGroup.add(c);
            } catch (d) {
                throw d instanceof CLIMachs.type.ConflictError && (d.message = 'The "' + a + '" permission group already exists, so it cannot be added.'), 
                d;
            }
            return this;
        }
    }, {
        key: "addPreCommandMiddleware",
        value: function(a, b) {
            var c = arguments.length <= 2 || void 0 === arguments[2] ? -1 : arguments[2];
            try {
                var d = new CLIMachs.type.Callback(a, b);
                this.preCommandMiddleware.add(d, c);
            } catch (e) {
                throw e instanceof CLIMachs.type.ConflictError && (e.message = 'The "' + a + '" pre-command middleware already exists, so it cannot be added.'), 
                e;
            }
            return this;
        }
    }, {
        key: "addPreResponseMiddleware",
        value: function(a, b) {
            var c = arguments.length <= 2 || void 0 === arguments[2] ? -1 : arguments[2];
            try {
                var d = new CLIMachs.type.Callback(a, b);
                this.preResponseMiddleware.add(d, c);
            } catch (e) {
                throw e instanceof CLIMachs.type.ConflictError && (e.message = 'The "' + a + '" pre-response middleware already exists, so it cannot be added.'), 
                e;
            }
            return this;
        }
    }, {
        key: "addPreRoutingMiddleware",
        value: function(a, b) {
            var c = arguments.length <= 2 || void 0 === arguments[2] ? -1 : arguments[2];
            try {
                var d = new CLIMachs.type.Callback(a, b);
                this.preRoutingMiddleware.add(d, c);
            } catch (e) {
                throw e instanceof CLIMachs.type.ConflictError && (e.message = 'The "' + a + '" pre-routing middleware already exists, so it cannot be added.'), 
                e;
            }
            return this;
        }
    }, {
        key: "evaluate",
        value: function(a) {
            var b = null;
            try {
                if (!a || "api" !== a.type) throw new CLIMachs.type.ArgumentError("message must be a Roll20 API chat message!");
                b = this.route(this.tokenize(a.contents), a);
            } catch (c) {
                c instanceof CLIMachs.type.CommandError ? b = new CLIMachs.type.CommandResponse(a, c.message, "self") : (log(c), 
                b = new CLIMachs.type.CommandResponse(a, "An unexpected error occurred! See the script execution log.", "self"));
            }
            return b;
        }
    }, {
        key: "removeCommand",
        value: function(a) {
            try {
                this.commands.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.type.NotFoundError && (b.message = "The " + a + " command could not be found, so it cannot be removed."), 
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
            if (b.length > 0) throw new CLIMachs.type.DependencyError("The " + a + " permission group cannotnot be removed because one or more commands depend upon it. Commands:" + b);
            try {
                this.permissionGroups.remove(a);
            } catch (c) {
                throw c instanceof CLIMachs.type.NotFoundError && (c.message = 'The "' + a + '" group command could not be found, so it cannot be removed.'), 
                c;
            }
            return this;
        }
    }, {
        key: "removePreCommandMiddleware",
        value: function(a) {
            try {
                this.preCommandMiddleware.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.type.NotFoundError && (b.message = 'The "' + a + '" pre-command middleware could not be found, so it cannot be removed.'), 
                b;
            }
            return this;
        }
    }, {
        key: "removePreResponseMiddleware",
        value: function(a) {
            try {
                this.preResponseMiddleware.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.type.NotFoundError && (b.message = 'The "' + a + '" pre-response middleware could not be found, so it cannot be removed.'), 
                b;
            }
            return this;
        }
    }, {
        key: "removePreRoutingMiddleware",
        value: function(a) {
            try {
                this.preRoutingMiddleware.remove(a);
            } catch (b) {
                throw b instanceof CLIMachs.type.NotFoundError && (b.message = 'The "' + a + '" pre-routing middleware could not be found, so it cannot be removed.'), 
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
            if (!(a instanceof Array)) throw new CLIMachs.type.ArgumentError("tokens must be a valid Array!");
            if (a.length > 0) throw new CLIMachs.type.ArgumentError("tokens must contain at least one element!");
            if (a.filter(function(a) {
                return "string" != typeof a;
            }) > 0) throw new CLIMachs.type.ArgumentError("tokens must contain only strings!");
            var d = this.preRoutingMiddleware.forEach(function(c) {
                return c.callback(a, b);
            }).map(function(c) {
                return c.callback(a, b);
            }).reduce(function(a, b) {
                return a ? a && b : !1;
            }, !0);
            if (!d) throw new Error("Operation aborted by middleware before message routing.");
            var e = c(a, null, this.commands);
            if (!e) throw new CLIMachs.type.NotFoundError("Command not found.");
            var f = this.preCommandMiddleware.map(function(c) {
                return c.callback(e, a, b);
            }).reduce(function(a, b) {
                return a ? a && b : !1;
            }, !0);
            if (!f) throw new Error("Operation aborted by middleware before command execution.");
            var g = e.execute(a, b), h = this.preResponseMiddleware.map(function(a) {
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
                return "<p>" + a + "</p>";
            });
            sendChat(b + ' <div style="' + c + ">" + d + '</div>"', a.speaker);
        }
    }, {
        key: "tokenize",
        value: function(a) {
            if ("string" != typeof a) throw new CLIMachs.type.ArgumentError("messageContents must be a valid string!");
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
            if (c instanceof CLIMachs.type.CommandResponse) try {
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
            return this.commands.data;
        }
    }, {
        key: "permissionGroups",
        get: function() {
            return this.permissionGroups.data;
        }
    }, {
        key: "preCommandMiddleware",
        get: function() {
            return this.preCommandMiddleware.data;
        }
    }, {
        key: "preResponseMiddleware",
        get: function() {
            return this.preResponseMiddleware.data;
        }
    }, {
        key: "preRoutingMiddleware",
        get: function() {
            return this.preRoutingMiddleware.data;
        }
    }, {
        key: "allCommands",
        get: function() {
            function a(b, c) {
                return c.reduce(function(b, c) {
                    return b.concat(a(b, c.subcommands));
                });
            }
            return a([], this.commands);
        }
    } ]), a;
}(), CLIMachs.cli = CLIMachs.cli || new CLIMachs.type.CLI(), on("ready", CLIMachs.cli.onReady);