import {RefreshTokenData, refreshTokenDataCollection} from "../db/db";

export const securityDevicesRepository = {
    async saveInfoAboutRefreshToken(infoRefreshToken: RefreshTokenData) {
        await refreshTokenDataCollection.insertOne(infoRefreshToken);
    },
    async delAllDevicesExcludeCurrent(deviceId: string) {
        await refreshTokenDataCollection.deleteMany({deviceId: {$ne: deviceId}});
    },
    async delDevice(deviceId: string): Promise<boolean> {
        const result = await refreshTokenDataCollection.deleteOne({deviceId: deviceId});
        return result.deletedCount === 1;
    },
    async getAllDevicesUser(userId: string) {
        const deviceInfo = await refreshTokenDataCollection.find({userId: userId}).toArray();
        return deviceInfo.map(a => {
            return {
                ip: a.ip,
                title: a.deviceName,
                lastActiveDate: a.iat,
                deviceId: a.deviceId
            }
        });
    },
    async delOldRefreshTokenData(date: string) {
        await refreshTokenDataCollection.deleteMany({exp: {$lt: date}});
    }
};