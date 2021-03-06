const getNetIdString = async (ethers) => {
    let network = await ethers.getNetwork();

    switch (network.chainId) {
        case 1:
            return 'Main Ethereum Network';
        case 3:
            return 'Ropsten Ethereum Test Network';
        case 4:
            return 'Rinkeby Ethereum Test Network';
        case 42:
            return 'Kovan Ethereum Test Network';
        case 'loading':
            return 'loading..';
        default:
            return 'Local Test Network';
    };
};

module.exports = {
    getNetIdString
};