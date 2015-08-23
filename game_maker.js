"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");
var manifest = require("./manifest.json");

exports.game = new Splat.Game(canvas, manifest);
