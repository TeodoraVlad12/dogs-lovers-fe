import React from "react";
import {Dog} from "../model/Dog";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, weight: string, age: string) => void;
    dog: Dog;
}


const ModalUpdate: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, dog}) => {
    const [name, setName] = React.useState(dog.getName());
    const [weight, setWeight] = React.useState(dog.getWeight().toString());
    const [age, setAge] = React.useState(dog.getAge().toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, weight, age);    //we pass the updated values to the parent components
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={onClose}>&times;</span>
                        <form onSubmit={handleSubmit}>
                            <input type="text" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)}/>
                            <input type="text" value={weight} placeholder="Weight" onChange={(e)=>setWeight(e.target.value)} />
                            <input type="text" value={age} placeholder="Age" onChange={(e)=>setAge(e.target.value)} />
                            <button type="submit">Update Dog</button>
                        </form>
                    </div>
                </div>
            )}
        </>

    );
};

export default ModalUpdate;