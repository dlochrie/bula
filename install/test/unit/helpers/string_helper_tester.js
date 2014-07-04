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
});
