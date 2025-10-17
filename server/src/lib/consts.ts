export const consts = {
    env: {
        port: process.env.PORT,
        nodeEnv: process.env.NODE_ENV
    },
    database: {
        uri: process.env.DATABASE_URI
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN
    },
    bcrypt: {
        saltRounds: process.env.BCRYPT_SALT_ROUNDS
    },
};
