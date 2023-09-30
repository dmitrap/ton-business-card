import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { BusinessCard, Like, SetInformation, User } from '../wrappers/BusinessCard';
import '@ton-community/test-utils';
import { totalmem } from 'os';

describe('BusinessCard', () => {
    let blockchain: Blockchain;
    let businessCard: SandboxContract<BusinessCard>;
    let deployer: SandboxContract<TreasuryContract>;
    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const userInfo: User = {
            $$type: 'User',
            name: "Vladimir Alefman",
            profesion: "Web3 Developer",
            bio: "I like to eat pizza"
        }

        businessCard = blockchain.openContract(await BusinessCard.fromInit(userInfo));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await businessCard.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: businessCard.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and businessCard are ready to use
    });

    it('should return user info', async ()=>{
        const info = await businessCard.getInfo()
        console.log(info)
    })

    it('should put like', async ()=>{
        const sender = await blockchain.treasury('sender');
        const likesBefore = await businessCard.getLikes()

        const messageLike : Like = {
            $$type: 'Like'
        }

        await businessCard.send(
            sender.getSender(),
            {
                value: toNano('0.1'),
            }, 
            messageLike
        )

        await businessCard.send(
            sender.getSender(),
            {
                value: toNano('0.1'),
            }, 
            messageLike
        )

        const likesAfter = await businessCard.getLikes()

        expect(likesAfter).toBeGreaterThan(likesBefore)
        expect(likesAfter).toBe(1n)

    })

    it("should set information", async ()=>{
        const owner = deployer
        const otherSender = await blockchain.treasury('otherSender');

        const userInfoBefore = await businessCard.getInfo()

        const setMessage: SetInformation = {
            $$type: 'SetInformation',
            name: "Vasya",
            profesion: "Front end developer",
            bio: "I don't like to eat pizza"
        }

        await businessCard.send(
            otherSender.getSender(),
            {
                value: toNano("0.1")
            },
            setMessage
        )

        let userInfoAfter = await businessCard.getInfo()
        
        expect(userInfoBefore.name).toBe(userInfoAfter.name)
        
        await businessCard.send(
            owner.getSender(),
            {
                value: toNano("0.1")
            },
            setMessage
        )

        userInfoAfter = await businessCard.getInfo()

        expect(userInfoAfter.name).toBe("Vasya")
        expect(userInfoAfter.profesion).toBe("Front end developer")
        expect(userInfoAfter.bio).toBe("I don't like to eat pizza")

    })
});
