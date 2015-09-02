if (navigator.userAgent.indexOf('PhantomJS') < 0)
  describe("hipbone", function() {
    describe("models", function() {
      describe("test", function() {
        it("test", function(done) {
          console.log(window.Backbone)
          console.log(window.Hipbone)
          done();
        });
      });
    });
  });
