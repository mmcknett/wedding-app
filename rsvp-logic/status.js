const getValidStatus = (status) => {
    switch(status) {
        case 'attending': return 'attending';
        case 'declined': return 'declined';
        default: return 'no-reply';
    }
}

module.exports = {
    getValidStatus
};
