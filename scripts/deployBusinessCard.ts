import { toNano } from 'ton-core';
import { BusinessCard, User } from '../wrappers/BusinessCard';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {

    const userInfo: User = {
        $$type: 'User',
        name: "Vladimir Alefman",
        profesion: "Web3 Developer",
        bio: "I like to eat pizza"
    }

    const businessCard = provider.open(await BusinessCard.fromInit(userInfo));

    await businessCard.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(businessCard.address);

    // run methods on `businessCard`
}
