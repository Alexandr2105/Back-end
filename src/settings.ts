export const settings = {
    JWT_SECRET: process.env.JWT_SECRET || "1234",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "12345",
    TOKEN_LIFE: process.env.TOKEN_LIFE || 100000,
    REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || 200000,
}