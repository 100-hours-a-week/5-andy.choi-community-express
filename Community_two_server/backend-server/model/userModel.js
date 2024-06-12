import fs, { read } from 'fs';
import path from 'path';
import userDAO from './repository/userDAO.js';

const __dirname = path.resolve();

const usersJsonDir = '/model/repository/users.json';
const replysJsonDir = '/model/repository/reply.json';
const postsJsonDir = '/model/repository/posts.json';

function readJson(sub_dir,encode){
    const usersJsonFile = fs.readFileSync(__dirname + sub_dir, encode);
    return JSON.parse(usersJsonFile);
}

function writeJson(sub_dir,usersJsonData,encode){
    fs.writeFileSync(__dirname + sub_dir,JSON.stringify(usersJsonData,null,2),encode);
}

async function validateUser(email, password) {
    // const usersJsonData = readJson(usersJsonDir,'utf8');

    // for (const key in usersJsonData){
    //     let user = usersJsonData[key];
    //     if(user.email == email && user.password == password){
    //         return true;
    //     }
    // }
    
    // return false;

    const foundUser = await userDAO.loginUser(email,password);
    if(foundUser.length === 0){
        return -1;
    }
    return foundUser[0].id;
}

function getUserId(email) {
    const usersJsonData = readJson(usersJsonDir,'utf8');

    for (const key in usersJsonData){
        let user = usersJsonData[key];
        if(user.email == email){
            return user["userId"];  
        }
    }

    // 실제 DAO를 통해 DB의 것을 가져오는 코드 구현할 것.
}

function getUsers(){
    return readJson(usersJsonDir,'utf8');
}

async function getUser(userId){
    // const usersJsonData = readJson(usersJsonDir,'utf8');
    
    // 여기서 유저 전체 정보를 넘기면 안됨 (비밀번호도 같이 넘어감)
    // return usersJsonData[userId];

    //실제 DAO 활용해서 구현해야 함.
    return await userDAO.getUserById(userId);
}

function assignId(){
    const usersJsonData = readJson(usersJsonDir,'utf8');
    let maxId = 0;
    for(const key in usersJsonData){
        const intKey = parseInt(key);
        if(intKey > maxId){
            maxId = intKey;
        }
    }
    return maxId + 1;
}

async function joinUser(email,password,nickName,profileImage){
    const usersJsonData = readJson(usersJsonDir,'utf8');

    const userId = await assignId();

    const newUser = {
        "userId":userId,
        "email":email,
        "password":password,
        "nickname":nickName,
        "profileImage":profileImage,
    }
    usersJsonData[userId] = newUser;
    writeJson(usersJsonDir,usersJsonData,'utf8');
}

function updateUser(originName,nickname,imgName){
    const usersJsonData = readJson(usersJsonDir,'utf8');

    let isFound = false;

    for(const Id in usersJsonData){
        if(usersJsonData[Id]["nickname"] === originName){
            usersJsonData[Id]["nickname"] = nickname;
            const user = usersJsonData[Id];
            user.nickname = nickname;
            user.profileImage = imgName;
            delete usersJsonData[Id];
            usersJsonData[Id] = user;
            isFound = true;

            writeJson(usersJsonDir,usersJsonData,'utf8');
            break;
        }
    }
    
    if(!isFound){
        console.log(`${originName}을(를) 찾을 수 없습니다.`);
    }
}

function deleteUser(userId){
    const usersJsonData = readJson(usersJsonDir,'utf8');
    const replysJsonData = readJson(replysJsonDir,'utf8');
    const postsJsonData = readJson(postsJsonDir,'utf8');

    if(userId in usersJsonData){
        delete usersJsonData[userId];
    }else {
        console.log(`${userId}을(를) 찾을 수 없습니다.`);
    }

    for(const postId in replysJsonData){
        const array = [];
        const replyArray = replysJsonData[postId];
        let isChanged = false;
        for(let idx = 0;idx<replyArray.length;idx++){
            const replyJson = replyArray[idx];
            if(parseInt(replyJson["userId"]) !== parseInt(userId)){
                array.push(replyJson);
            }else{
                isChanged = true;
            }
        }
        if(isChanged){
            delete replysJsonData[postId];
            replysJsonData[postId] = array;
        }
    }

    for(const postId in postsJsonData){
        const post = postsJsonData[postId];
        if(parseInt(post.userId) === parseInt(userId)){
            delete postsJsonData[postId];
        }
    }

    writeJson(usersJsonDir,usersJsonData,'utf8');
    writeJson(replysJsonDir,replysJsonData,'utf8');
    writeJson(postsJsonDir,postsJsonData,'utf8');
}

function updatePassword(userId,password){
    const usersJsonData = readJson(usersJsonDir,'utf8');

    if(userId in usersJsonData){
        usersJsonData[userId]["password"] = password;
        writeJson(usersJsonDir,usersJsonData,'utf8');
    }else{
        console.log(`${userId}을(를) 찾을 수 없습니다.`);
    }
}

export default {
    validateUser,
    getUserId,
    getUsers,
    joinUser,
    updateUser,
    updatePassword,
    deleteUser,
    getUser,
};