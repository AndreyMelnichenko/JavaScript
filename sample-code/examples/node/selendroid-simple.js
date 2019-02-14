"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers');

describe("selendroid simple", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;

  before(function () {
    var serverConfig = serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);

    var desired = _.clone(require("./helpers/caps").selendroid16);
    desired.app = require("./helpers/apps").androidApiDemos;
    return driver
      .init(desired)
      .setImplicitWaitTimeout(3000);
  });

  after(function () {
    return driver
      .quit();
  });

  afterEach(function () {
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it("should find elements", function () {
    return driver
	    .waitForElementByXPath("//*[@text='Animation']")
      //.waitForElementByName('Animation')
        .text().should.become('Animation')
	    .sleep(5000)
      .elementByClassName('android.widget.TextView')
        .text().should.eventually.match(/Accessibility|API Demos/)
      .elementByName('App').click()
      .waitForElementByXPath('//TextView[@name=\'Action Bar\']')
      .elementsByClassName('android.widget.TextView')
        .should.eventually.have.length.above(20)
      .back()
      .sleep(3000)
      .waitForElementByName('Animation', 5000, 500)
        .text().should.become('Animation');
  });
});
