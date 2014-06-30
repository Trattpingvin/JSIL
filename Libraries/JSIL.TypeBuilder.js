"use strict";

if (typeof (JSIL) === "undefined")
  throw new Error("JSIL.js must be loaded first");

JSIL.TypeBuilder = function (typeObject) {
  this.resultProperties = Object.create(Function.prototype);
  this.resultPrototype = Object.create(null);
  this.typeObject = typeObject;
  this.resultConstructor = function () {};
  this.publicInterface = null;

  this.declareConstant("__Type__", true, typeObject);
};

JSIL.TypeBuilder.prototype.setConstructor = function (ctor) {
  if (this.publicInterface)
    throw new Error("Public interface already created");

  this.resultConstructor = ctor;
};

JSIL.TypeBuilder.prototype.declareConstant = function (key, isStatic, value) {
  var target = isStatic ? this.resultProperties : this.resultPrototype;

  Object.defineProperty(target, key, {
    value: value,
    enumerable: true,
    configurable: true,
    writable: false,
    writeable: false
  });
};

JSIL.TypeBuilder.prototype.declareMethod = function (key, isStatic, fn) {
  this.declareConstant(key, isStatic, fn);
};

JSIL.TypeBuilder.prototype.getPublicInterface = function () {
  if (this.publicInterface)
    return this.publicInterface;

  this.publicInterface = this.resultConstructor;

  if (Object.setPrototypeOf)
    Object.setPrototypeOf(this.publicInterface, this.resultProperties);
  else
    this.publicInterface.__proto__ = this.resultProperties;

  this.publicInterface.prototype = this.resultPrototype;

  return this.publicInterface;
};