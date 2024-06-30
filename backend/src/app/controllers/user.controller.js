const {CREATED, OK} = require("../../core/success.response");
const AccessService = require("../services/user.service");

class AccessController {

    signUp = async (req, res) => {
        // req body: username, password, email
        new CREATED({
            message: "register succeed",
            metadata: await AccessService.signUpService(req.body),
            options: {
                subdata: "some extra data"
            }
        }).send(res)
    }

    login = async (req, res) => {
        // req body email, password
        new CREATED({
            message: "login succeed",
            metadata: await AccessService.loginService(req.body),
        }).send(res);
    }

    getall = async (req, res) => {
        new OK({
            message:"get all user succeed",
            metadata: await AccessService.getalluser()
        }).send(res);
    }

    // pass user id to delete in keystore
    logout = async (req, res) => {
        
        new OK({
            message:"logout succeed",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }

    addNote = async(req, res) => {

        new OK({
            message:"add new note succeed",
            metadata: await AccessService.addNote(req.body, req.keyStore)
        }).send(res);
    }

    getNoteOfUser = async(req, res) => {

        const {limit, offset} = req.query;

        new OK({
            message:"get note of user - role user",
            metadata: await AccessService.getNoteOfUser(req.keyStore, {
                limit, offset
            })
        }).send(res)
    }

    getAllNoteByAdmin = async (req, res) => {

        new OK({
            message:"get all note by admin",
            metadata: await AccessService.getAllNoteByAdmin()
        }).send(res)
    }
}

module.exports = new AccessController();