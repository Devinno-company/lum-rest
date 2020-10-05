import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import NewUser from '../interfaces/request/NewUserRequest';
import UserRepository from '../repositorys/UserRepository';
import User from '../models/User';
import Credentials from '../interfaces/request/CredentialsRequest';
import LoginRepository from '../repositorys/LoginRepository';

export default class UserController {

    async newUser(newUser: NewUser) {

        return new Promise(async (resolve, reject) => {
            /* CRIPTOGRAFA A SENHA */
            newUser.password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync());
            /* TIRA POSSÍVEIS ESPAÇOS QUE SOBRAM NAS EXTREMIDADES */
            newUser.name = newUser.name.trim();
            newUser.surname = newUser.surname.trim();
            newUser.email = newUser.email.toLowerCase().trim();
            newUser.password = newUser.password.trim();
            
            /* INSERE O USUÁRIO NO BANCO ATRAVÉS DE UMA CLASSE ESTÁTICA */
            UserRepository.insertUser(newUser)
                .then((result: User) => {
                    // GERA O TOKEN DE AUTENTICAÇÃO
                    const token = jsonwebtoken.sign({
                        id: result.cd_user
                    }, process.env.SECRET as string);

                    resolve({ token });
                })
                .catch(err => reject(err));
        });
    }

    async login(credentials: Credentials): Promise<{ token: string }> {
        credentials.email = credentials.email.toLowerCase();

        return new Promise(async (resolve, reject) => {
            const login = await LoginRepository.findLoginByEmail(credentials.email);

            if (!login) 
                reject({ message: 'Incorrect credentials', status: 409 });
            else {
                /* VERIFICA SE A SENHA É CORRETA */
                const valid = bcrypt.compareSync(credentials.password, login.nm_password);
                console.log(valid);
                
                if (valid) {
                    const user = await UserRepository.findUserByEmail(credentials.email);
                    /* GERA O TOKEN DE AUTENTICAÇÃO */
                    const token = jsonwebtoken.sign({ id: user.cd_user }, process.env.SECRET as string);
                    resolve({ token });
                } else {
                    reject({ message: 'Incorrect credentials', status: 409 });
                }
            }
        });
    }
}