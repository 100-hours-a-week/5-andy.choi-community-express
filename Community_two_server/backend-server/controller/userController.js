import model from '../model/userModel.js';

async function validateUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const userId = await model.validateUser(email, password);

    const resultJson = {
        result : userId
    }
    
    if (resultJson.result !== -1) {
        req.session.user = {
            userId: `${resultJson.result}`,
            authorized: true,   
        }
    }

    res.status(200).json(resultJson);
}

function joinUser(req,res){
    const Body = req.body;

    const email = Body.email;
    const password = Body.password;
    const nickName = Body.nickName;
    const profileImage = Body.profileImage;
    
    model.joinUser(email,password,nickName,profileImage);
    res.status(204).send("join_success");
}

function updateUser(req,res){
    const userId = req.body.userId;
    const nickname = req.body.nickname;
    const imgName = req.body.imgName;

    model.updateUser(userId,nickname,imgName);
    res.status(204).send("update_success");
}

function updatePassword(req,res){
    const userId = req.body.userId;
    const password = req.body.password;

    model.updatePassword(userId,password);
    res.status(204).send("update_success");
}

function deleteUser(req,res){
    const userId = req.body.userId;
    model.deleteUser(userId);
    res.status(204).send("delete_success");
}

async function getUser(req,res){
    const userId = req.params.userId;
    const user = await model.getUser(userId);
    res.json(user);
}

async function getUserByNickname(req,res){
    const nickname = req.params.nickname;
    const userId = await model.getUserByNickname(nickname);
    res.json(userId);
}

async function getUserByEmail(req,res){
    const email = req.params.email;
    const userId = await model.getUserByEmail(email);
    res.json(userId);
}

export default {
    validateUser,
    joinUser,
    updateUser,
    updatePassword,
    deleteUser,
    getUser,
    getUserByNickname,
    getUserByEmail
}