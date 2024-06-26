export function checkDuplicatenickName(nickName){
    return new Promise((resolve,reject) => {
    fetch('/api/users')
    .then(response => response.json())
    .then(data => {
        let isDuplicate = false;
        if(nickName in data){
            isDuplicate = true;
        }
        
        if (isDuplicate) {
            resolve("*중복된 닉네임 입니다.");
        } else {
            resolve("");
        }
    })
    .catch(error => {
        reject(error); // 에러가 발생한 경우
    });
});
}

export function checkDuplicateEmail(email){
    return new Promise((resolve,reject) => {
    fetch('/api/users')
    .then(response => response.json())
    .then(data => {
        let isDuplicate = false;
        for(const user in data){
            if(data[user]["email"] == email){
                isDuplicate = true;
                break;
            }
        }
        
        if (isDuplicate) {
            resolve("*중복된 이메일 입니다.");
        } else {
            resolve("");
        }
    })
    .catch(error => {
        reject(error); // 에러가 발생한 경우
    });
});
}