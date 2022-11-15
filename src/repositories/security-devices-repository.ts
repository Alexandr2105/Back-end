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
    async delOldRefreshTokenData(date: Date) {
        await refreshTokenDataCollection.deleteMany({exp: {$lt: date}});
    },
    async updateInfoAboutDeviceUser(iat: Date, exp: Date, deviceId: string, ip: string, deviceName: string | undefined, userId: string) {
        await refreshTokenDataCollection.updateOne({$and: [{userId: userId}, {deviceId: deviceId}]}, {
            $set: {
                iat: iat,
                exp: exp,
                ip: ip,
                deviceName: deviceName
            }
        })
    }
};