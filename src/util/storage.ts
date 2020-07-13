import fs from 'fs';
import path from 'path';


export default class Storage {

    /**
     * 获取已有的用户数据，以启动定时任务
     */
    static getUsers() {
        // console.log(path.resolve(process.cwd(), './static/data.json'));
        const content = fs.readFileSync(path.resolve(process.cwd(), './static/data.json'), 'utf-8');
        let fileContent: Yiban.UsersData = {};
        if (content.length !== 0) {
            fileContent = JSON.parse(content);
        }
        return fileContent;
    }

    /**
     * 存储用户数据
     * @param newUser 
     */
    static storageUsers(newUser: Yiban.User) {
        const fileContent = Storage.getUsers();
        const filePath = path.resolve(process.cwd(), './static/data.json');
        fileContent[`${newUser.email}`] = newUser;
        fs.writeFileSync(filePath, JSON.stringify(fileContent));
    }


}