import jwt from "jsonwebtoken";
const { sign } = jwt;
export const createAccessToken = (user) => {
    return sign({ userId: user._id.toString(), listId: user.shoppingListId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m", algorithm: 'ES512' });
};
export const createRefreshToken = (user) => {
    return sign({ userId: user._id.toString(), tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d", algorithm: 'ES512' });
};
export const sendRefreshToken = (res, token) => {
    res.cookie("jid", token, {
        httpOnly: true,
        path: '/refresh_token',
        sameSite: 'strict',
        secure: false
    });
};
//# sourceMappingURL=auth.js.map