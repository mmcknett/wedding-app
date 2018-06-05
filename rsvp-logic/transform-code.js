const transformCode = (inviteCode) => {
    let transf = inviteCode.toUpperCase();
    
    while (transf.includes('-')) {
        transf = transf.replace('-', '');
    }
    
    while (transf.includes('1')) {
        transf = transf.replace('1', 'I');
    }

    while (transf.includes('0')) {
        transf = transf.replace('0', 'O');
    }

    return transf;
}

module.exports = transformCode;
