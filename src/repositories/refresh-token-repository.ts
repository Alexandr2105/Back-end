import {RefreshTokenData, refreshTokenDataCollection} from "../db/db";

export const refreshTokenRepository = {
    async saveInfoAboutRefreshToken(infoRefreshToken: RefreshTokenData) {
        await refreshTokenDataCollection.insertOne(infoRefreshToken);
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
    }
}