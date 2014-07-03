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
});
