import React from "react";

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userDetails: { username: string; email: string; country: string } | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, userDetails }) => {
    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={onClose}>&times;</span> {/* "x" button */}

                        <h2>User Details</h2>
                        {userDetails ? (
                            <>
                                <p>Username: {userDetails.username}</p>
                                <p>Email: {userDetails.email}</p>
                                <p>Country: {userDetails.country}</p>
                            </>
                        ) : (
                            <p>Loading user details...</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default UserDetailsModal;
