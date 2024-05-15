import React from "react";

interface ModalAddDogProps {
    isOpen: boolean;
    onClose: () => void,
    onSubmit: (name: string, weight: string, age: string) => void;
}

const ModalAddDog: React.FC<ModalAddDogProps> = ({isOpen, onClose, onSubmit}) => {
    const [name, setName] = React.useState("");
    const [weight, setWeight] = React.useState("");
    const [age, setAge] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, weight, age);
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={onClose}>&times;</span>
                        <form onSubmit={handleSubmit}>
                            <input type="text" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} />
                            <input type="text" value={weight} placeholder="Weight" onChange={(e) => setWeight(e.target.value)} />
                            <input type="text" value={age} placeholder="Age" onChange={(e) => setAge(e.target.value)} />
                            <button type="submit">Add Dog Now</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalAddDog;