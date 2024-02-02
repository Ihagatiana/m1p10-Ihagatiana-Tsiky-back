var authService = require('./authService')

const test = async (req,res) => {
    try {
        console.log('test')
        res.status(200).json({
            data:{'test':'test'},
            status:200
        })
    } catch (error) {
        res.status(400).json({
            data:error,
            status:400
        })
    }
}

const login = async (req,res) => {
    try {
        console.log(req.body.user);
        const user = await authService.checkPasswordUser(req.body.user);
        res.status(200).json({
            data:user,
            status:200
        })
    } catch (error) {
        res.status(400).json({
            data:error,
            status:400
        })
    }
}

const signup = async (req,res) => {
    try {
        const user = await authService.saveUser(req.body.user);
        res.status(200).json({
            data:user,
            status:200
        })
    } catch (error) {
        res.status(400).json({
            data:error,
            status:400
        })
    }
}

module.exports = {login,signup,test };