"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers');

var chai = require('chai')
	, expect = chai.expect
	, should = chai.should();

describe("android webview", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;

  beforeEach(function () {
    var serverConfig = serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);

    var desired = _.clone(require("./helpers/caps").android19);
    desired.app = "C:\\protractor\\sample-code\\apps\\selendroid-test-app.apk";

    return driver
      .init(desired)
      .setImplicitWaitTimeout(3000)
	    .elementById('buttonStartWebviewCD')
	    .click()
	    .sleep(5000)
	    .contexts()
	    .then(function (ctxs) {
		    console.log(ctxs);
		    return driver.context(ctxs[ctxs.length - 1]);
	    });
  });

  after(function () {
	  //allPassed = allPassed && this.currentTest.state === 'passed';
	  return driver
		  .quit();

});

  afterEach(function () {
  	console.log("\n\n\nTEST STATUS: " + this.currentTest.state);
     allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it("should switch to webview", function () {
		return driver.source().then(function (source) {
				source.should.include('Prefered Car');
			})
			.elementById('name_input')
			.clear()
			.sendKeys('Appium User')
			.sendKeys(wd.SPECIAL_KEYS.Return)
			.sleep(1000)
			.source().then(function (source) {
				source.should.include('This is my way of saying hello');
				source.should.include('Appium User');
			});
	});

	it("clik button", function () {
		return driver
			.elementById('name_input')
			.clear()
			.sendKeys('Andrey')
			//.sendKeys(wd.SPECIAL_KEYS.Return)
			.elementByXPath('//input[2]')
			.click()
			.sleep(1000)
			.source().then(function (source) {
				source.should.include('volvo');
				source.should.include('Andrey');
			});
	});

	it("change car", function () {
		return driver
		.source().then(function (source) {
			source.should.include('Prefered Car');
			})
		.elementByCssSelector("select[name*='car']")
		.click()
		.sleep(1000)
		.contexts().then(function (ctxs) {
				console.log(ctxs);
				return driver.context(ctxs[0]);
			})
		.elementByXPath("//*[@text='Mercedes']")
		.click()
		.sleep(2000)
		.elementByXPath("//*[@text='Send me your name!']")
		.click()
		.sleep(2000)
		.source().then(function (source) {
				source.should.include('mercedes');
			});
	});

	it("equal text", function () {
		return driver
			.source().then(function (source) {
				source.should.include('Prefered Car');
			})
			.elementById('name_input')
			.clear()
			.sendKeys('Andrey')
			.sendKeys(wd.SPECIAL_KEYS.Return)
			.sleep(2000)
			.elementByCssSelector("body > h3:nth-child(3)")
			.text()
			.then(function(text) {
				console.log("!!!!!!!!!!!!");
				console.log(text);
			})
			.sleep(2000)
			.elementByCssSelector("body > a")
			.text().should.become('here')
			.then(function(text) {
				console.log("!!!!!!!!!!!!");
				console.log(text);
			});
	});

	it("elemet collection", function () {
		  return driver
			.source().then(function (source) {
				source.should.include('Prefered Car');
			})
			.elementById('name_input')
			.clear()
			.sendKeys('Andrey')
			.sendKeys(wd.SPECIAL_KEYS.Return)
			.sleep(2000)
			.elementsByCss("body > *")
			.text()
			.then(function(text) {
				var myArr = text.split("\n");
				console.log(myArr);
				text.should.include('"Andrey"');
			 });
	});
});
