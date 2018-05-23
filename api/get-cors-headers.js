const getCorsHeaders = (event) => {
    // TODO: Use a more exclusive regex to match the domain; this will allow subdomains that include the domain.
    const origin = event.headers.origin;
    const accessControlAllowOrigin = origin && origin.includes('rsvp.amynmatt.life') ? origin : null;
    console.log(`Origin is "${origin}", origin allowed is "${accessControlAllowOrigin}"`);
    
    return {
        'Access-Control-Allow-Origin': accessControlAllowOrigin,
        'Access-Control-Allow-Credentials': true
    };
}

module.exports = getCorsHeaders;
