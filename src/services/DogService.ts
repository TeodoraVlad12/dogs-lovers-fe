import axios, { AxiosRequestConfig } from "axios";
import fs from 'fs';
import {Dog} from "../model/Dog";
import {ChartData} from "../model/ChartData";
import {Consultation} from "../model/Consultation";
import {appConfig} from "../appConfig";



interface QueuedRequest  {
    method: string;
    url: string;
    headers: Record<string, string>;
}

interface QueuedRequestWithData extends QueuedRequest {
    data: any;
}

class MyQueuedRequestWithData implements QueuedRequestWithData {
    method: string;
    url: string;
    headers: Record<string, string>;
    data: any;

    constructor(method: string, url: string, headers: Record<string, string>, data: any) {
        this.method = method;
        this.url = url;
        this.headers = headers;
        this.data = data;
    }
}

export class DogService {


    private requestQueue: (QueuedRequest | QueuedRequestWithData)[] = [];
    private requestQueueWithData: QueuedRequestWithData [] = [];

    //private requestQueue: QueuedRequest[] = [];
    private queueKey: string = 'queuedRequests';
    private queueKeyWithData: string = 'queuedRequestsWithData';

    constructor() {
        this.loadQueuedRequests();
        this.loadQueuedRequestsWithData();
    }

    public async queueRequest(request: QueuedRequest) {
        this.requestQueue.push(request);
        await this.saveQueuedRequests();
    }

    public async executeQueuedRequests() {
        this.loadQueuedRequests();
        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            try {
                if (!request) {
                    continue;
                }



                const config: AxiosRequestConfig = {
                    method: request.method,
                    url: request.url,
                    headers: request.headers,

                };
                // Execute request
                console.log('Executing request:', request);
                await axios(config);
            } catch (error) {
                console.error('Error executing request:', error);
            }
        }
        // Clear queue after execution
        await this.clearQueuedRequests();
    }


    private async saveQueuedRequests() {
        try {
            const serializedRequests = JSON.stringify(this.requestQueue);
            localStorage.setItem(this.queueKey, serializedRequests);
        } catch (error) {
            console.error('Error saving queued requests to localStorage:', error);
        }
    }

    private async loadQueuedRequests() {
        try {
            const serializedRequests = localStorage.getItem(this.queueKey);
            if (serializedRequests) {
                this.requestQueue = JSON.parse(serializedRequests);
            }
        } catch (error) {
            console.error('Error loading queued requests from localStorage:', error);
        }
    }

    private async clearQueuedRequests() {
        try {
            this.requestQueue = [];
            localStorage.removeItem(this.queueKey);
        } catch (error) {
            console.error('Error clearing queued requests from localStorage:', error);
        }
    }

    public async queueRequestWithData(request: QueuedRequestWithData) {
        this.requestQueueWithData.push(request);
        await this.saveQueuedRequestsWithData();
    }


    private async loadQueuedRequestsWithData() {
        try {
            const serializedRequests = localStorage.getItem(this.queueKeyWithData);
            if (serializedRequests) {
                this.requestQueueWithData = JSON.parse(serializedRequests);
            }
        } catch (error) {
            console.error('Error loading queued requests with data from localStorage:', error);
        }
    }


    private async saveQueuedRequestsWithData() {
        try {
            const serializedRequests = JSON.stringify(this.requestQueueWithData);
            localStorage.setItem(this.queueKeyWithData, serializedRequests);
        } catch (error) {
            console.error('Error saving queued requests with data to localStorage:', error);
        }
    }


    private async clearQueuedRequestsWithData() {
        try {
            this.requestQueueWithData = [];
            localStorage.removeItem(this.queueKeyWithData);
        } catch (error) {
            console.error('Error clearing queued requests with data from localStorage:', error);
        }
    }


    public async executeQueuedRequestsWithData() {
        await this.loadQueuedRequestsWithData();
        while (this.requestQueueWithData.length > 0) {
            const request = this.requestQueueWithData.shift();
            try {
                if (!request) {
                    continue;
                }

                const config: AxiosRequestConfig = {
                    method: request.method,
                    url: request.url,
                    headers: request.headers,
                    data: request.data
                };
                // Execute request
                console.log('Executing request:', request);
                await axios(config);
            } catch (error) {
                console.error('Error executing request:', error);
            }
        }

        await this.clearQueuedRequestsWithData();
    }

    checkServerStatus=async()=>{
        try {
            const token = localStorage.getItem('token');

            const headers = {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            };

            await axios.get(`${appConfig.apiUrl}/dogs/filter/number/'a'`, {headers} );
            console.log('Server is up from service');
            this.loadQueuedRequests();
            this.loadQueuedRequestsWithData();
            console.log("length of the requests queue: ", this.requestQueue.length);
            console.log("length of the requests queue with data: ", this.requestQueueWithData.length);

            await this.executeQueuedRequests();
            await this.executeQueuedRequestsWithData();
            return true;
        } catch (error) {

            console.error('Error checking server status:', error);
            return false;
        }
    }






    getAllDogs =async() => {

        try {
            const token = localStorage.getItem('token');

            const headers = {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`${appConfig.apiUrl}/dogs`, {headers});
            const dogs: Dog[] = [];

            for (const dog of response.data) {
                dogs.push(new Dog(dog.id, dog.name, dog.weight, dog.age))
            }

            return dogs;
        }catch(error){
            alert("Failed to fetch all dogs");
        }
    }


    async addDog(name: string, weight: number, age: number): Promise<Dog > {

        const token = localStorage.getItem('token');

        const customHeaders = {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        };

        if (name === "" || isNaN(weight) || isNaN(age)) {
            throw new Error('Missing or invalid input');
        }

        const requestData = {
            name: name,
            weight: weight,
            age: age
        };

        const config: AxiosRequestConfig = {
            method: 'POST',
            url: `${appConfig.apiUrl}/dogs`,
            headers: customHeaders,
            data: requestData
        };



        try {
            const response = await axios(config);

            if (!response.data) {
                throw new Error('Failed to add dog');
            }

            console.log(response.data);

            const newDog = new Dog(response.data.id, response.data.name, response.data.weight, response.data.age);

            return newDog;
        } catch (error) {
            console.error('Error adding dog:', error);

            console.log("We are adding request to the queue");

           // const headers: Record<string, string> = config.headers as Record<string, string>;

            const queuedRequest: QueuedRequestWithData = {
                method: config.method || '',
                url: config.url || '',
                headers: customHeaders,
                data: requestData
            };



            // Add the request to the queue
            this.queueRequestWithData(queuedRequest);
           // this.queueRequest(queuedRequest2);
            console.log("Request queue with data: ", this.requestQueueWithData.length);
            return Promise.reject(error);
        }
    }





    async updateDog(id: number, name: string, weight: number, age: number): Promise<Dog> {

        const token = localStorage.getItem('token');

        const customHeaders = {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        };

        if (name === "" || isNaN(weight) || isNaN(age)) {
            throw new Error('Missing or invalid input');
        }

        const updatedDogData = {
            name: name,
            weight: weight,
            age: age
        };

        const config: AxiosRequestConfig = {
            method: 'PUT',
            url: `${appConfig.apiUrl}/dogs/${id}`,
            headers: customHeaders,
            data: updatedDogData
        };

        try {
            const response = await axios(config);

            if (!response.data) {
                throw new Error('Failed to update dog');
            }

            console.log(response.data);

            const updatedDog = new Dog(response.data.id, response.data.name, response.data.weight, response.data.age);

            return updatedDog;
        } catch (error) {
            console.error('Error updating dog:', error);
            console.log("We are adding request to the queue");

            //const headers: Record<string, string> = config.headers as Record<string, string>;

            const queuedRequest: QueuedRequestWithData = {
                method: config.method || '',
                url: config.url || '',
                headers: customHeaders,
                data: updatedDogData
            };

            this.queueRequestWithData(queuedRequest);

            console.log("Request queue with data: ", this.requestQueueWithData.length);

            return Promise.reject(error);
        }
    }


    async deleteDog(id: number): Promise<void> {

        const token = localStorage.getItem('token');

        const customHeaders = {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        };

        const config: AxiosRequestConfig = {
            method: 'DELETE',
            url: `${appConfig.apiUrl}/dogs/${id}`,
            headers: customHeaders,

        };
        try {

            const response = await axios(config);

        } catch (error) {
            console.error('Error deleting dog:', error);
            console.log("We are adding request to the queue");
            //const headers: Record<string, string> = config.headers as Record<string, string>;
            const queuedRequest: QueuedRequest = {
                method: config.method || '',
                url: config.url || '',
                headers: customHeaders
            };

            // Add the request to the queue
            this.queueRequest(queuedRequest);
            console.log("Request queue: ", this.requestQueue.length);
        }
    }




    getDogsFilteredByName =async(name: string)=> {
       try {
           const token = localStorage.getItem('token');

           const headers = {
               Authorization: token ? `Bearer ${token}` : '',
               'Content-Type': 'application/json',
           };

           const response = await axios.get(`${appConfig.apiUrl}/dogs/filter/${name}`, {headers});
           const dogs: Dog[] = [];

           for (const dog of response.data) {
               dogs.push(new Dog(dog.id, dog.name, dog.weight, dog.age))
           }

           return dogs;
       } catch(error){
           alert("Failed to fetch get dogs filtered by name");
       }
    }

    getDogsFilteredByAge =async(age: number)=> {
        try {

            const token = localStorage.getItem('token');

            const headers = {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`${appConfig.apiUrl}/dogs/filter/age/${age}`, {headers});
            const dogs: Dog[] = [];

            for (const dog of response.data) {
                dogs.push(new Dog(dog.id, dog.name, dog.weight, dog.age))
            }

            return dogs;
        } catch (error){
            alert("Failed to get dogs filtered by age");
        }
    }


    getDogsFilteredByNamePagination = async (name: string, page: number, limit: number): Promise<Dog[]> => {
        try {

            const token = localStorage.getItem('token');
            console.log("token: ", token);


            const headers = {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            };


            const response = await axios.get(
                `${appConfig.apiUrl}/dogs/filter/pagination/${name}?limit=${limit}&page=${page}`,
                { headers }
            );


            const dogsData: any[] = response.data;


            const dogs: Dog[] = dogsData.map((dog: any) => new Dog(dog.id, dog.name, dog.weight, dog.age));

            return dogs;
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error fetching dogs:', error);
            throw new Error('Failed to fetch dogs');
        }
    };

    getNumberOfDogsFiltered = async (name: string) => {

        try {
            const token = localStorage.getItem('token');

            const headers = {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`${appConfig.apiUrl}/dogs/filter/number/${name}`, {headers} );
            console.log(response.data + "response in the service");


            return response.data;
        }catch (error){
            alert("Error when fetching the total number of dog");
        }
    };



    // Function to fetch number of dogs in categories
    getNumberOfDogsInCategories = async (): Promise<any> => {
        try {

            const token = localStorage.getItem('token');

            const headers = {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`${appConfig.apiUrl}/dogs/chart/categories`, {headers});

            // Extract counts from response data
            const zeroThree = response.data.zeroThree;
            const fourSeven = response.data.fourSeven;
            const eightTen = response.data.eightTen;

            // Create an object to return
            const counts = {
                zeroThree: zeroThree,
                fourSeven: fourSeven,
                eightTen: eightTen
            };

            console.log("chart data in service: ", counts); // Log the counts object

            return counts;
        } catch (error) {
            throw new Error('Failed to fetch number of dogs in categories');
        }
    };


    getConsultationsForDog= async(dogId: number): Promise<Consultation[]>=> {
        try {
            const response = await axios.get(`${appConfig.apiUrl}/dogs/consultation/${dogId}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch consultations');
        }
    }

    getConsultationsForDogPaginated = async (dogId: number, page: number, limit: number)=> {
        try {
            console.log("getConsultationsForDogPaginated is called");
            const response = await axios.get(`${appConfig.apiUrl}/dogs/consultation/${dogId}`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            if (dogId == 0){
                return [];
            }
        }
    };









}