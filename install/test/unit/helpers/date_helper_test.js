var DateHelper = require('../../../app/helpers/date');

describe('Date Helper', function() {
  var now = new Date;

  it('should get a new date', function(done) {
    var date = DateHelper.getDate();
    date.should.be.an.Object;
    date.should.be.a.Date;
    date.getDay().should.eql(now.getDay());
    date.getFullYear().should.eql(now.getFullYear());
    done();
  });

  it('should get a Human-Readable date', function(done) {
    var date = DateHelper.getHumanDate(now);
    date.should.be.a.string;
    date.should.containEql(now.getDate());
    date.should.containEql(now.getFullYear());
    var historicalDate = DateHelper.getHumanDate(-6106017600000);
    historicalDate.should.be.a.string;
    historicalDate.should.containEql('July 4th 1776');
    var noDate = DateHelper.getHumanDate();
    noDate.should.be.a.string;
    noDate.should.containEql(now.getDate());
    noDate.should.containEql(now.getFullYear());
    var invalid = DateHelper.getHumanDate('a string');
    invalid.should.be.a.string;
    invalid.should.containEql(now.getDate());
    invalid.should.containEql(now.getFullYear());
    done();
  });

  it('should get a list of the last three months', function(done) {
    var months = DateHelper.lastThreeMonths();
    months.should.be.an.Array.and.have.length(3);
    var names = DateHelper.MONTHS_;
    names.should.be.an.Array.and.have.length(12);

    // Set up month assertions.
    var first = new Date(),
        second = new Date(),
        third = new Date();
    second.setMonth(first.getMonth() - 1);
    third.setMonth(first.getMonth() - 2);

    // Test for existence and equality of last 3 months.
    var firstName = names[first.getMonth()],
        secondName = names[second.getMonth()],
        thirdName = names[third.getMonth()];
    months[0].should.eql(firstName);
    months[1].should.eql(secondName);
    months[2].should.eql(thirdName);
    months.should.eql([firstName, secondName, thirdName]);
    // The reversed list should NOT match.
    months.should.not.eql([thirdName, secondName, firstName]);
    done();
  });

  it('should get a list of the last three years', function(done) {
    var currentYear = new Date().getFullYear();
    var years = DateHelper.lastThreeYears();
    years.should.be.an.Array.and.have.length(3);
    years.should.eql([currentYear - 1, currentYear - 2, currentYear - 3]);
    // The reversed list should NOT match.
    years.should.not.eql([currentYear - 3, currentYear - 2, currentYear - 1]);
    done();
  });
});
