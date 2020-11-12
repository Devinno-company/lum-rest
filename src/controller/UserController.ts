import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import NewUser from '../interfaces/request/NewUserRequest';
import UserRepository from '../repositorys/UserRepository';
import User from '../models/User';
import Credentials from '../interfaces/request/CredentialsRequest';
import LoginRepository from '../repositorys/LoginRepository';
import UserResponse from '../interfaces/response/UserResponse';
import LocationUserRepository from '../repositorys/LocationUserRepository';
import CityRepository from '../repositorys/CityRepository';
import GeolocationRepository from '../repositorys/GeolocationRepository';
import LinkMercadoPagoRepository from '../repositorys/LinkMercadoPagoRepository';
import Axios from 'axios';
import updateLinkMercadoPago from '../interfaces/inputRepository/updateLinkMercadoPago';

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

            const searchUser = await LoginRepository.findLoginByEmail(newUser.email);

            if (!searchUser) {
                const insertedLogin =
                    await LoginRepository.insertLogin(newUser.email, newUser.password)
                        .catch((err) => { reject({ status: 400, message: 'Unknown error. Try again later', err }) });

                if (insertedLogin) {
                    UserRepository.insertUser(newUser, insertedLogin.cd_login)
                        .then((result: User) => {

                            const token = jsonwebtoken.sign({
                                id: result.cd_user
                            }, process.env.SECRET as string);

                            resolve({ token });
                        })
                        .catch(err => reject(err));
                }
            }
            else
                reject({ message: 'This email already register', status: 409 });
        });
    }

    async login(credentials: Credentials): Promise<{ token: string }> {
        credentials.email = credentials.email.toLowerCase();

        return new Promise(async (resolve, reject) => {
            const login = await LoginRepository.findLoginByEmail(credentials.email);

            if (!login)
                reject({ message: 'Incorrect credentials', status: 401 });
            else {
                /* VERIFICA SE A SENHA É CORRETA */
                const valid = bcrypt.compareSync(credentials.password, login.nm_password);

                if (valid) {
                    const user = await UserRepository.findUserByEmail(credentials.email);
                    /* GERA O TOKEN DE AUTENTICAÇÃO */
                    const token = jsonwebtoken.sign({ id: user.cd_user }, process.env.SECRET as string);
                    resolve({ token });
                } else {
                    reject({ message: 'Incorrect credentials', status: 401 });
                }
            }
        });
    }

    async readUserByEmail(email: string): Promise<UserResponse> {

        return new Promise(async (resolve, reject) => {

            const user = await UserRepository.findUserByEmail(email);
            if (!user)
                reject({ status: 404, message: "This user don't exists" });
            else {
                const login = await LoginRepository.findLoginById(user.cd_login);
                let location;

                if (user.cd_location_user)
                    location = await LocationUserRepository.findLocationUserById(user.cd_location_user);

                if (location) {
                    const searchCity = await CityRepository.findCityById(location.cd_city);
                    const searchGeolocation = await GeolocationRepository.findGeolocationById(location.cd_geolocation);

                    location = {
                        city: searchCity.nm_city,
                        uf: searchCity.sg_uf,
                        geolocation: {
                            latitude: searchGeolocation.cd_latitude,
                            longitude: searchGeolocation.cd_longitude
                        }
                    }
                } else {
                    location = null;
                }

                resolve({
                    id: user.cd_user,
                    name: user.nm_user,
                    surname: user.nm_surname_user,
                    email: login.nm_email,
                    biography: user.ds_biography,
                    label: user.nm_label,
                    website: user.ds_website,
                    image: user.im_user,
                    company: user.nm_company,
                    location: location
                });
            }
        });
    }

    getLinkMercadoPagoAccount(authorization_code: string, state_id: string) {
        return new Promise(async (resolve, reject) => {

            const link = await LinkMercadoPagoRepository.findLinkMercadoPagoByIdentificationId(state_id)
            if (!link)
                reject({ status: 404, message: 'there are no records with this id in our bank' })
            else {
                Axios.post('https://api.mercadopago.com/oauth/token', {
                    client_secret: process.env.ACCESS_TOKEN_MP,
                    grant_type: 'authorization_code',
                    code: authorization_code,
                    redirect_uri: process.env.REDIRECT_URI_MP
                })
                    .then((response) => {
                        console.log(response.data);
                        
                        const updateLink: updateLinkMercadoPago = {
                            refresh_token: response.data.refresh_token,
                            cd_public_key: response.data.public_key,
                            id_valid: true,
                            cd_access_token: response.data.access_token,
                        }
                        LinkMercadoPagoRepository.updateLinkMercadoPago(link.cd_link_mercado_pago, updateLink)
                            .then(() => resolve())
                            .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));
                    })
                    .catch((err) => {
                        reject({ status: 400, message: 'Unknown error. Try again later.', err });
                    });
            }

        });
    }

    linkMercadoPagoAccount(user: User) {
        return new Promise(async (resolve, reject) => {

            const app_id = process.env.APP_ID_MP as string;
            const redirect_uri = process.env.REDIRECT_URI_MP as string;

            let random_id = '0';
            let continue_process = false;

            do {
                random_id = `${Math.random() * 100}`;
                const searchLink = await LinkMercadoPagoRepository.findLinkMercadoPagoByIdentificationId(random_id);

                if (!searchLink)
                    continue_process = true;
            } while (!continue_process);

            const link = `https://auth.mercadopago.com.br/authorization?client_id=${app_id}&response_type=code&platform_id=mp&redirect_uri=${redirect_uri}&state=${random_id}`;

            LinkMercadoPagoRepository.insertLinkMercadoPago(random_id, user.cd_user)
                .then(() => resolve(link))
                .catch((err) => reject({ status: 400, message: 'Unknown error. Try again later.', err }));
        });
    }
}