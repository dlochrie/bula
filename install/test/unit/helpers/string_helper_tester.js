var StringHelper = require('../../../app/helpers/string');

describe('String Helper', function() {
  it('should convert markdown text to html', function(done) {
    var testString = '# Header\n * item 1\n * item 2\n * item 3';
    StringHelper.convertMarkdown(testString).should.eql(
        '<h1 id=\"header\">Header</h1>\n<ul>\n<li>item 1</li>\n' +
        '<li>item 2</li>\n<li>item 3</li>\n</ul>\n');
    var testString2 = '[Go to Google](www.google.com)';
    StringHelper.convertMarkdown(testString2).should.eql(
        '<p><a href=\"www.google.com\">Go to Google</a></p>\n');
    var testString3 = '`code`\n\n    var foo = "bar";';
    StringHelper.convertMarkdown(testString3).should.eql(
        '<p><code>code</code></p>\n<pre><code>var foo = &quot;bar&quot;;\n' +
        '</code></pre>');

    // Assert that non-strings don't break the application.
    StringHelper.convertMarkdown({}).should.eql('');
    StringHelper.convertMarkdown(['one', 'two', 'three']).should.eql('');
    StringHelper.convertMarkdown(9876543210).should.eql('');
    done();
  });

  it('should convert strings to slugs for links', function(done) {
    var testCases = [
      'ALLCAPS',
      'all!@#$%^&*()-chars',
      null,
      undefined,
      'alllower',
      'lots-of-hyphens-in-here',
      'CamelCaseString',
      'snake_case_string',
      'i,have,commas,in,here',
      ''
    ];
    StringHelper.convertToSlug(testCases[0]).should.eql('allcaps');
    StringHelper.convertToSlug(testCases[1]).should.eql('all-chars');
    StringHelper.convertToSlug(testCases[2]).should.match(/^\d+$/);
    StringHelper.convertToSlug(testCases[3]).should.match(/^\d+$/);
    StringHelper.convertToSlug(testCases[4]).should.eql('alllower');
    StringHelper.convertToSlug(testCases[5]).should.eql(
        'lots-of-hyphens-in-here');
    StringHelper.convertToSlug(testCases[6]).should.eql('camelcasestring');
    StringHelper.convertToSlug(testCases[7]).should.eql('snakecasestring');
    StringHelper.convertToSlug(testCases[8]).should.eql('ihavecommasinhere');
    StringHelper.convertToSlug(testCases[9]).should.match(/^\d+$/);
    done();
  });

  it('should sanitize a string', function(done) {
    var testCases = [
      'some string\t\n\n\r        ',
      '\t     some string\t\n\n\r        ',
      '     some  text  here\t\n    ',
      null,
      undefined
    ];
    StringHelper.sanitize(testCases[0]).should.eql('some string');
    StringHelper.sanitize(testCases[1]).should.eql('some string');
    StringHelper.sanitize(testCases[2]).should.eql('some  text  here');
    StringHelper.sanitize(testCases[3]).should.eql('');
    StringHelper.sanitize(testCases[4]).should.eql('');
    done();
  });

  describe('error groups', function() {
    var action = 'Playing "The Adventure of Link"';
    var errors;

    it('should create error groups for strings', function(done) {
      // Assert that error groups are created with populated strings.
      errors = 'I am Error';
      StringHelper.createErrorGroup(action, errors).should.eql(
          '<strong>The following errors were encountered while Playing ' +
          '\"The Adventure of Link\":</strong><ul><li>' +
          '<i class=\"fa fa-flash\"></i> I am Error</li></ul>');

      // Assert that error groups are created with empty strings.
      errors = '';
      StringHelper.createErrorGroup(action, errors).should.containEql(
          '<ul><li><i class="fa fa-flash"></i> N/A</li></ul>');

      // Assert that error groups are created with null.
      errors = null;
      StringHelper.createErrorGroup(action, errors).should.containEql(
          '<ul><li><i class="fa fa-flash"></i> N/A</li></ul>');
      done();
    });

    it('should create error groups for arrays', function(done) {
      // Assert that error groups are created with populated arrays.
      errors = ['Missing name.', 'Not a string.', 'Not a number.'];
      var errorGroup = StringHelper.createErrorGroup(action, errors);
      errorGroup.should.containEql(
          '<i class=\"fa fa-flash\"></i> Missing name.</li>');
      errorGroup.should.containEql(
          '<i class=\"fa fa-flash\"></i> Not a string.</li>');
      errorGroup.should.containEql(
          '<i class=\"fa fa-flash\"></i> Not a number.</li>');

      // Assert that error groups are created with arrays that have bad values.
      errors = ['', null, undefined];
      errorGroup = StringHelper.createErrorGroup(action, errors);
      errorGroup.should.containEql('<i class=\"fa fa-flash\"></i> N/A</li>');
      // "N/A" should have been found 3 times, one for each invalid/empty error.
      errorGroup.match(/N\/A/g).should.be.an.Array.and.have.length(3);

      // Assert that error groups are created with empty arrays.
      errors = [];
      StringHelper.createErrorGroup(action, errors).should.eql(
          '<strong>The following errors were encountered while Playing ' +
          '\"The Adventure of Link\":</strong><ul><li>' +
          '<i class=\"fa fa-flash\"></i> There was a system error.</li></ul>');
      done();
    });
  });
});
