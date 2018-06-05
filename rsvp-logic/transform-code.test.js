const transformCode = require('./transform-code');

it('must transform codes properly', () => {
    expect(transformCode('abcd-EFio-1234-7890-10io')).toEqual('ABCDEFIOI234789OIOIO');
});
