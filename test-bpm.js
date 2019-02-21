"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers');
var appPath = require('./platform.js');
var getProperty = require('./fileReader.js');

describe("android webview", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;

  beforeEach(function () {
    var serverConfig = serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);

    var desired = _.clone(require("./helpers/caps").android19);
    desired.app = appPath("apps/test-app.apk");

    return driver
      .init(desired)
      .setImplicitWaitTimeout(3000)
	    .sleep(5000)
	    .contexts()
	    .then(function (ctxs) {
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

  it("should switch to webview and get context", function () {
		return driver
			.sleep(1000)
			.elementByXPath("//*[@placeholder='mysite.bpmonline.com']")
			.sendKeys(getProperty("server.adress"))
			.sleep(1000)
			.elementByCss('#LoginPage')
			.tap()
			// .contexts()
			// .then(function (ctxs) {
			// 	return driver.context(ctxs[ctxs.length - 2]);
			// })
			// .getWindowSize()
			// .then(function (size) {
			// 	var x = size.width / 2;
			// 	var y = size.height / 2 + 100;
			// 	var action = new wd.TouchAction(driver);
			// 	action.tap({x:x, y:y});
			// 	return driver.performTouchAction(action);
			// })
			// .contexts()
			// .then(function (ctxs) {
			// 	return driver.context(ctxs[ctxs.length - 1]);
			// })
			.sleep(1000)
			.elementByCss("#LoginPage_continueButton > .x-button-label")
			.tap()
			.elementByCss(".x-msgbox").should.eventually.exist
			.elementByCss(".x-msgbox-text > div").text().should.become('Invalid bpm\'online server address specified or the server is not available at the moment')
			.elementByCss('div[data-item-marker="ok"]').tap()
			.elementByCss('#LoginPage').should.eventually.exist
			.sleep(5000);
	});

	it('DEMO-ENTER', function () {
		return driver
			.elementByCss("#LoginPage_demoLoginButton > .x-button-label")
			.should.eventually.exist
			.tap()
			.elementByCss("#DemoLoginPage")
			.should.eventually.exist
			.elementByCss("#DemoLoginPage_forwardButton")
			.should.eventually.exist
			.tap()
			.sleep(5000);
	});
});
