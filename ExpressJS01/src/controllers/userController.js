const {
    createUserService,
    loginService,
    getUserService
} = require("../services/userService");

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = await createUserService(name, email, password);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Lỗi server" });
    }
}

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await loginService(email, password);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Lỗi server" });
    }
}

const getUser = async (req, res) => {

    const data = await getUserService();

    return res.status(200).json(data);
}

const getAccount = async (req, res) => {

    return res.status(200).json(req.user);
}

module.exports = {
    createUser,
    handleLogin,
    getUser,
    getAccount
}