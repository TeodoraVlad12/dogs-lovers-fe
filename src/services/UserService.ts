
import axios from "axios";
import {appConfig} from "../appConfig";


export class UserService {

    async  logIn(username: string, password: string): Promise<boolean> {
        if (username === "" || password === "") {
            throw new Error('Missing username or password');
        }

        const requestData = {
            username: username,
            password: password
        };

        try {
            const response = await axios.post(`${appConfig.apiUrl}/login`, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data.token) {
                throw new Error('Failed to login');
            }

            // Store the token in localStorage
            localStorage.setItem('token', response.data.token);

            return true;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                alert('No account with this username, please Register first');
            } else if (axios.isAxiosError(error) && error.response?.status === 402) {
                alert('Wrong password');
            } else {
                // @ts-ignore
                console.error('Error logging in:', error.message);
            }
            return false;
        }
    }


    /*async logIn(username: string, password: string):Promise <boolean>  {
        if (username === "" || password==="") {
            throw new Error('Missing username or password');
        }



        const requestData = {
            username: username,
            password: password
        };

        try {
            const response = await axios.post('http://localhost:8000/login', requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });


            if (!response.data) {
                throw new Error('Failed to login');
            }

            console.log(response.data);

            const loggedin: boolean = response.data;

            return loggedin;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                alert('No account with this username, please Register first');
            } else {
                if (axios.isAxiosError(error) && error.response?.status === 402) {
                    alert('Wrong password');
            }}
            return false;

        }
    }
*/

    async register(username: string, password: string, email: string, country: string):Promise <boolean>  {
        if (!username  || !password) {
            throw new Error('Missing username or password');
        }



        const requestData = {
            username: username,
            password: password,
            email: email,
            country: country
        };

        try {
            const response = await axios.post(`${appConfig.apiUrl}/register`, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });


            if (!response.data) {
                throw new Error('Failed to register');

            }

            console.log(response.data);

            const registered: boolean = response.data;

            return registered;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                alert('There is already an account with this username');
            } else {
                alert('Failed to register');
            }
            return false;

        }
    }


    async getUserDetails(): Promise<{ username: string; email: string; country: string } | null> {
        try {
            // Fetch user details from the backend
            const response = await axios.get(`${appConfig.apiUrl}/userDetails`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            // Return user details if available
            return response.data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    }

    logout(): void {
        localStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('token');
        return !!token;   //converting token to boolean
    }

}