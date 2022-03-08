module.exports = {
    name: 'ready',
    execute(client) {
        console.log(`Ready! Login as My Bot`);
        client.user.setActivity('In Development', {type: 'MATCHING'});
    }
}