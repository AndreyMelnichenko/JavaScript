"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers');

describe("android webview", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;

  beforeEach(function () {
    var serverConfig = serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);

    var desired = _.clone(require("./helpers/caps").android19);
    desired.app = "C:\\protractor\\sample-code\\apps\\test-app.apk";

    return driver
      .init(desired)
      .setImplicitWaitTimeout(3000)
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

  it("should switch to webview and get context", function () {
		return driver.source().then(function (source) {
				//console.log(source);
			})
			.sleep(1000)
			.elementByXPath("//*[@placeholder='mysite.bpmonline.com']")
			.sendKeys('Andrey')
			.sleep(1000)
			.contexts()
			.then(function (ctxs) {
				console.log(ctxs);
				return driver.context(ctxs[ctxs.length - 2]);
			})
			.getWindowSize()
			.then(function (size) {
				var x = size.width / 2;
				var y = size.height / 2 + 100;
				var action = new wd.TouchAction(driver);
				action.tap({x:x, y:y});
				return driver.performTouchAction(action);
			})
			// .performTouchAction().then(function (touchAction) {

			// 		//console.log(y, " => ", x);
			// 		action.moveTo({x:x, y:y})
			// 		.press({x:x, y:y})
			// 		.release();
			// 		//return
			// 		action.perform();
			// })

			// 	var action = new wd.TouchAction(driver);
			// 	//console.log(y, " => ", x);
			// 	action.moveTo({x:x, y:y})
			// 	.press({x:x, y:y})
			// 	.release();
			// 	//return
			// 	action.perform();
			// })
			// .elementById("#LoginPage_continueButton")

			//.elementByCss("#LoginPage_version > div")
			//.sleep(1000)
			//.click()
			//.tap()
			.sleep(5000);
	});
});
