import {refreshTokenDataCollection} from "../db/db";

export const securityDevicesRepository = {
    async delAllDevicesExcludeCurrent(deviceId: string) {
        await refreshTokenDataCollection.deleteMany({deviceId: {$ne: deviceId}});
    },
    async delDevice(deviceId: string): Promise<boolean> {
        const result = await refreshTokenDataCollection.deleteOne({deviceId: deviceId});
        return result.deletedCount === 1;
    }
};