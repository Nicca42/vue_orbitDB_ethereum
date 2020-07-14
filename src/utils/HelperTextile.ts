import { Buckets, PushPathResult, KeyInfo } from '@textile/hub'
import { Libp2pCryptoIdentity } from '@textile/threads-core';

class BucketHelper {
    getIdentity = async (identity:string): Promise<Array<any>> => {
        try {
            var storedIdent = identity;
            if (storedIdent === null) {
                throw new Error('No identity');
            }
            const restored = Libp2pCryptoIdentity.fromString(storedIdent);
            const identityString = identity.toString();
            return [restored, identityString];
            }
        catch (e) {
            /**
             * If any error, create a new identity.
             */
            try {
                const identity = await Libp2pCryptoIdentity.fromRandom();
                const identityString = identity.toString();
                return [identity, identityString];
            } catch (err) {
                return err.message;
            }
        }
    }
    // getBucketKey = async (identity:string, key:string, keySecret:string, keyType:number): string[] => {
    //     let libID = Libp2pCryptoIdentity.fromString(identity);
    //     let keyInfo: KeyInfo = {
    //         key: key,
    //         secret: keySecret,
    //         // @ts-ignore
    //         type: keyType
    //     }

    //     if (!libID) {
    //         throw new Error('Identity not set')
    //     }
    //     const buckets = await Buckets.withKeyInfo(keyInfo);
    //     // Authorize the user and your insecure keys with getToken
    //     await buckets.getToken(libID);

    //     const root = await buckets.open('io.textile.dropzone');

    //     if (!root) {
    //         throw new Error('Failed to open bucket')
    //     }
    //     return ([buckets],[root.key]);
    // }
}

export { BucketHelper };
// module.exports = {
//   output: {
//     filename: 'BucketHelper.ts'
//   },
//   module: {
//     rules: [
//       { test: /\.ts$/, loader: 'awesome-typescript-loader' }
//     ]
//   }
// };