// Force the `test` environment for tests.
process.env.NODE_ENV = 'test';

// Make sure the global `app` is available to tests.
app = this.app || require('../app');

// Attach the `bula-test` module to the global `app`. `bula-test` contains
// utilities for seeding fixtures and mocking authentication/sessions in tests.
require('bula-test')(app);
