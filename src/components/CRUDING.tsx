import React, { useEffect, useState } from "react";
import { Dog } from '../model/Dog';
import { ChartData } from '../model/ChartData';
import ModalUpdate from './ModalUpdate';
import ModalAddDog from './ModalAddDog';
import "./ModalUpdate.css";
import "./CRUD.css"
import BarChart from "./BarChart";
import { DogService } from "../services/DogService";
import {UserService} from "../services/UserService";
import UserDetailsModal from "./ModalUserDetails";
import {Consultation} from "../model/Consultation";



interface Props {
    dogs: Dog[];
}

function CRUDING() {

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const userService   : UserService = new UserService();

    useEffect(() => {

        setLoggedIn(userService.isLoggedIn);

    }, [] );

    const handleLogout = () => {
        // Call the logout method from UserService
        userService.logout();
        // Set loggedIn state to false
        setLoggedIn(false);
    };




    return (
        <div className="container">
            {loggedIn ? <> <DogList /> <button onClick={handleLogout}>Logout</button> </>  : <LoginAndRegister setLoggedIn={setLoggedIn} />}
        </div>
    );
}

function DogList() {


    const dummyDog= new Dog(0,"a Dog", 1, 1);


    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState<boolean>(false);
    const [isModalOpenAdd, setIsModalOpenAdd] = useState<boolean>(false);
    const [selectedDogIndex, setSelectedDogIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentDog, setCurrentDog]= useState<Dog>(dummyDog);

    const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
    const [numberFilteredDogs, setNumberFilteredDogs]= useState<number>(0);
    const [chartData, setChartData] = useState<ChartData|null>(null);

    const [serverIsUp, setServerIsUp] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const dogsPerPage = 3;

    const service: DogService = new DogService();
    const userService   : UserService = new UserService();

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [usernameLogin, setUsernameLogin] = useState<string>("");
    const [usernameRegister, setUsernameRegister] = useState<string>("");
    const [passwordLogin, setPasswordLogin] = useState<string>("");
    const [passwordRegister, setPasswordRegister] = useState<string>("");
    const [emailRegister, setEmailRegister] = useState<string>("");
    const [countryRegister, setCountryRegister] = useState<string>("");

    const [isAccountDetailsModalOpen, setIsAccountDetailsModalOpen] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<{ username: string; email: string; country: string } | null>(null);

    const [consultations, setConsultations] = useState<Consultation[]>([]);


    useEffect(() => {

        const checkServerStatus = async () => {
            try {
                const status = await service.checkServerStatus();
                console.log("server status: ", status);

                setServerIsUp(status);
            } catch (error) {
                console.error('Error checking server status:', error);
                // Handle error
            }
        };


        checkServerStatus();

        console.log("server is up: ", serverIsUp);


        const interval = setInterval(() => {
            checkServerStatus();
        }, 5000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);



    useEffect(() => {

        service.getDogsFilteredByNamePagination("--", 1, dogsPerPage).then((filteredDogsPagination: Dog[]) => {
            console.log("am apelat la inceput");
            setFilteredDogs(filteredDogsPagination);
            console.log(filteredDogsPagination);
        })
        service.getNumberOfDogsFiltered("--").then((nr) => {
            setNumberFilteredDogs(nr);
            console.log("Number filtered dogs la inceput de crud: " + nr);
        });
        service.getNumberOfDogsInCategories().then((data) => {
            console.log("chart data from the service in crud: " + data);
            setChartData(data);
            console.log("chart data:" + chartData);
        });
        fetchUserDetails();

    }, [] ); // Empty dependency array means this effect runs only once when the component mounts



    useEffect(() => {
        console.log("chart data in hook:", chartData);
    }, [chartData]);



    const fetchUserDetails = async () => {
        try {
            const userDetails = await userService.getUserDetails();
            setUserDetails(userDetails);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const openAccountDetailsModal = () => {
        setIsAccountDetailsModalOpen(true); // Step 3: Function to open modal
    };

    const closeAccountDetailsModal = () => {
        setIsAccountDetailsModalOpen(false); // Step 3: Function to close modal
    };

    const handleUpdate = (index: number, dog: Dog) => {
        setSelectedDogIndex(index);
        setIsModalOpenUpdate(true);
        setCurrentDog(dog);
    };

    const handleAdd = () => {
        setIsModalOpenAdd(true);
    };

    const handleCloseModalUpdate = () => {
        setIsModalOpenUpdate(false);
    };

    const handleCloseModalAdd = () => {
        setIsModalOpenAdd(false);
    };


    const handleDelete = async (id: number) => {
        if (serverIsUp){
            try {
                await service.deleteDog(id);



                const updatedDogs = await service.getDogsFilteredByNamePagination("--", currentPage, dogsPerPage);

                setFilteredDogs(updatedDogs);

                const numberFilteredDogs = await service.getNumberOfDogsFiltered("--");
                setNumberFilteredDogs(numberFilteredDogs);



                //update chart
                const updatedChartData = await service.getNumberOfDogsInCategories();
                setChartData(updatedChartData);
            } catch (error) {
                console.error('Error deleting dog when server is up:', error);
                alert(error);
            }} else {
            try {
                await service.deleteDog(id);
                setFilteredDogs(filteredDogs => filteredDogs.filter(dog => dog.getId() !== id));
            } catch(error){
                console.error('Error deleting dog when server is down:', error);
                alert(error);
            }

        }

    };



    const handleUpdateSubmit = async (name: string, weight: string, age: string) => {
        if (serverIsUp){try {
            if (currentDog != null) {

                const updatedDogData = await service.updateDog(currentDog.getId(), name, parseFloat(weight), parseInt(age));


                const updatedDog: Dog = new Dog(updatedDogData.getId(), updatedDogData.getName(), updatedDogData.getWeight(), updatedDogData.getAge());




                const updatedDogs = await service.getDogsFilteredByNamePagination("--", currentPage, dogsPerPage);



                setFilteredDogs(updatedDogs);

                const numberFilteredDogs = await service.getNumberOfDogsFiltered("--");
                setNumberFilteredDogs(numberFilteredDogs);

                //update chart
                const updatedChartData = await service.getNumberOfDogsInCategories();
                setChartData(updatedChartData);
            }
        } catch (error) {
            console.error('Error updating dog when server is up:', error);
            alert(error);
        }
        } else {
            try {


                const updatedDog: Dog = new Dog(currentDog.getId(), name, parseFloat(weight), parseInt(age));
                setFilteredDogs(filteredDogs => {
                    return filteredDogs.map(dog => {
                        if (dog.getId() === currentDog.getId()) {
                            return updatedDog; // Replace current dog with updated one
                        }
                        return dog; // Return unchanged dog
                    });
                });

                await service.updateDog(currentDog.getId(), name, parseFloat(weight), parseInt(age));


            } catch (error){
                console.error('Error updating dog when server is down:', error);
                alert(error);
            }
        }

    };




    const handleAddSubmit = async (name: string, weight: string, age: string) => {
        if (serverIsUp)
        {try {

            const newDogData = await service.addDog(name, parseFloat(weight), parseInt(age));


            const newDog: Dog = new Dog(newDogData.getId(), newDogData.getName(), newDogData.getWeight(), newDogData.getAge());



            const updatedDogs = await service.getDogsFilteredByNamePagination("--", currentPage, dogsPerPage);



            setFilteredDogs(updatedDogs);

            const numberFilteredDogs = await service.getNumberOfDogsFiltered("--");
            setNumberFilteredDogs(numberFilteredDogs);


            const updatedChartData = await service.getNumberOfDogsInCategories();
            setChartData(updatedChartData);
        } catch (error) {
            console.error('Error adding dog when server is up:', error);
            alert(error);
        }} else {
            try{
                const newDog: Dog = new Dog(-1, name, parseFloat(weight), parseInt(age));
                setFilteredDogs(filteredDogs => [...filteredDogs, newDog]);

                await service.addDog(name, parseFloat(weight), parseInt(age));


            } catch(error){
                console.log("Error adding dog when server is down", error);
                alert(error);
            }

        }

    };





    const handleSearchQueryChange = async (query: string) => {
        setSearchQuery(query);
        try {
            let valueSearchQuery: string = query;

            if (query.trim() === "") {
                valueSearchQuery = "--";
            }

            const filteredDogs = await service.getDogsFilteredByNamePagination(valueSearchQuery, 1, dogsPerPage);
            const numberFilteredDogs = await service.getNumberOfDogsFiltered(valueSearchQuery);
            setNumberFilteredDogs(numberFilteredDogs);
            setFilteredDogs(filteredDogs);
        } catch (error) {
            console.error('Error filtering dogs:', error);

        }
    };



    const paginateDogs = async (pageNumber : number) => {
        try {
            let valueSearchQuery: string = searchQuery;

            if (searchQuery.trim() === "") {
                valueSearchQuery = "--";
            }


            const paginatedDogs = await service.getDogsFilteredByNamePagination(valueSearchQuery, pageNumber, dogsPerPage);



            console.log("am apelat in paginate");
            setFilteredDogs(paginatedDogs);
        } catch (error) {
            console.error('Error paginating dogs:', error);

        }
    };



    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        console.log("current page: "+ pageNumber);
        paginateDogs(pageNumber);

    };

    const handleConsultations = async (dogId: number, dog: Dog) => {
        try {
            const consultations = await service.getConsultationsForDog(dogId);
            // Update state to display the consultations
            // For example, set them to a state variable and display them in a modal or list
            setConsultations(consultations);
            setCurrentDog(dog);
        } catch (error) {
            console.error('Error fetching consultations:', error);
            alert('Failed to fetch consultations');
        }
    };




    return (
        <div className="container">

            <div className="left">
                <h1>Dogs List</h1>


                {!serverIsUp && (<p style={{ color: 'red', fontSize: '18px' }}>Server is down</p>)}

                <div>


                    <button onClick={openAccountDetailsModal}>See Account Details</button>

                    <UserDetailsModal isOpen={isAccountDetailsModalOpen} onClose={closeAccountDetailsModal} userDetails={userDetails} />


                </div>

                <div>

                    {serverIsUp && ( <input
                        className="input"
                        type="text"
                        value={searchQuery}
                        /*onChange={(e) => setSearchQuery(e.target.value)}*/
                        onChange={(e) =>  handleSearchQueryChange(e.target.value)}
                        placeholder="Search dog by name..."
                    />)}

                </div>

                <div>

                    <ul className="list-group">
                        {filteredDogs.map((dog, index) => (
                            <li key={dog.getId()} className="list-group-item" id={`list-item-${dog.getId()}`} data-testid={`list-item-${dog.getId()}`}>
                                <strong>{dog.getName()}</strong> - Weight: {dog.getWeight()} kg, Age: {dog.getAge()} years
                                {/*<button onClick={() => handleDelete(index)}>X</button>*/}
                                <button onClick={() => handleDelete(dog.getId())} id={`delete-button-${dog.getId()}`} data-testid={`delete-button-${dog.getId()}`}>X</button>
                                {/* <button onClick={() => handleUpdate(index)} id={`update-button-${dog.getId()}`}>Update</button>*/}
                                <button onClick={() => handleUpdate(index, dog)} id={`update-button-${dog.getId()}`} data-testid={`update-button-${dog.getId()}`}>Update</button>
                                {serverIsUp && (<button onClick={() => handleConsultations(dog.getId(), dog)}>See Consultations</button>)}
                            </li>
                        ))}
                    </ul>

                    <ul className="pagination" style={{ display: 'flex', listStyle: 'none' }}>
                        {/*we compute the number of pages needed*/}
                        {Array.from({ length: Math.ceil(numberFilteredDogs / dogsPerPage) }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
                            </li>
                        ))}
                    </ul>

                </div>

                {isModalOpenUpdate && selectedDogIndex != null && (
                    <ModalUpdate isOpen={true} onClose={handleCloseModalUpdate} onSubmit={handleUpdateSubmit} dog={currentDog} />
                )}

                <button onClick={() => handleAdd()}>Add Dog</button>

                {isModalOpenAdd && (
                    <ModalAddDog isOpen={true} onClose={handleCloseModalAdd} onSubmit={handleAddSubmit} />
                )}

                {serverIsUp && ( <div>
                     <h2>Consultations List for {currentDog.getName()}</h2>
                    <ul>
                        {consultations.map((consultation, index) => (
                            <li key={index}>
                                {/* Render consultation details here */}
                                <p>Date:{new Date(consultation.date).toLocaleString()}</p>
                                <p>Medication Used: {consultation.medicationUsed}</p>
                                <p>Notes: {consultation.notes}</p>
                            </li>
                        ))}
                    </ul>
                </div>  )}
            </div>



            <div className="right" style={{ width: 700 }} data-testid="bar-chart">



                {chartData && <BarChart chartData={chartData} />}


            </div>

        </div>

    );}

function LoginAndRegister({ setLoggedIn }: { setLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [usernameLogin, setUsernameLogin] = useState<string>("");
    const [usernameRegister, setUsernameRegister] = useState<string>("");
    const [passwordLogin, setPasswordLogin] = useState<string>("");
    const [passwordRegister, setPasswordRegister] = useState<string>("");
    const [emailRegister, setEmailRegister] = useState<string>("");
    const [countryRegister, setCountryRegister] = useState<string>("");

    const userService   : UserService = new UserService();
    const handleLogin = async () => {

        try {

            const loggedIn: boolean = await userService.logIn(usernameLogin, passwordLogin);
            if (loggedIn){
                setLoggedIn(true);
            }


        } catch (error) {
            console.error('Error during login:', error);
            alert(error);
        }
    }


    const handleRegister = async () => {

        try {

            const registered: boolean = await userService.register(usernameRegister, passwordRegister, emailRegister, countryRegister);
            if (registered){
                alert("Registered successfully! Now you can log in");
                //setLoggedIn(true);
            }


        } catch (error) {
            console.error('Error during register:', error);
            alert("Failed to register");
        }
    }

    return (
        <div className="login-register-section">
            <div className="login">
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={usernameLogin}
                    onChange={(e) => setUsernameLogin(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={passwordLogin}
                    onChange={(e) => setPasswordLogin(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
            <div className="register">
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Set username"
                    value={usernameRegister}
                    onChange={(e) => setUsernameRegister(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Set password"
                    value={passwordRegister}
                    onChange={(e) => setPasswordRegister(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={emailRegister}
                    onChange={(e) => setEmailRegister(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={countryRegister}
                    onChange={(e) => setCountryRegister(e.target.value)}
                />
                <button onClick={handleRegister}>Register</button>
            </div>
        </div>

    );
}

export default CRUDING;
