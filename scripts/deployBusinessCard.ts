import { toNano } from 'ton-core';
import { BusinessCard } from '../wrappers/BusinessCard';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const businessCard = provider.open(await BusinessCard.fromInit());

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
