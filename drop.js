const { Client, Environment, PublicKey } = require('@kinecosystem/kin-sdk-v2');
const BigNumber = require('bignumber.js');
const client = new Client(Environment.Test, { kinVersion: 4 });

const Koa = require('koa');
const app = new Koa();

app.use(airdrop);


async function airdrop(ctx) {
    const address = ctx.request.querystring;

    let txID;
    const publicKey = getPublicKey(address);

    if (!publicKey) {
        ctx.body = "Invalid Address"
        return;
    }

    const kinTokenAccounts = await client.resolveTokenAccounts(publicKey);
    const destination = kinTokenAccounts[0];
    const totalKin = kinToQuarks(10);

    try {
        txID = await client.requestAirdrop(destination, new BigNumber(totalKin));
        ctx.body = 'Dropped to address: ' + address;
    } catch (e) {
        ctx.body = e;
    }

}
 
function kinToQuarks(kin) {
    return kin * 100000;
}

function getPublicKey(address) {
    let publicKey;

    try {
        publicKey = PublicKey.fromBase58(address);
    } catch (e) {
        publicKey = null;
    }

    if (publicKey === null) {
        try {
            publicKey = PublicKey.fromString(address);
        } catch (e) {
            publicKey = null;
        }

    }

    return publicKey;

}


app.listen(process.env.PORT);