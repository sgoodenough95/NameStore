const NameStore = artifacts.require('contracts/NameStore.sol');

contract('NameStore', () => {
    let nameStore = null;
    before(async () => {
        nameStore = await NameStore.deployed();
    });

    it('Should set name', async () => {
        await nameStore.setName('Alice');
        const result = await nameStore.name();
        assert(result === 'Alice');
    });

    it('Should update name', async () => {
        await nameStore.setName('Alice');

        await nameStore.setName('Bob');
        const result = await nameStore.name();
        assert(result === 'Bob');
    });

    it('Should read name', async () => {
        await nameStore.setName('Alice');

        const result = await nameStore.readName();
        assert(result === 'Alice');
    });
});