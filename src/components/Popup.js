import React, { useState, useEffect } from 'react';
import { Alert } from "@material-tailwind/react";

const Popup = ({ message, onClose, color }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            onClose(); // Call onClose to close the popup after the timeout
        }, 2000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {show &&
                <div className="flex w-full flex-col gap-2">
                    {color === 'green' ? (
                        <Alert className="rounded-none border-l-4 border-green-500 bg-green-100 font-medium text-green-800"
                            color={color}>
                            {message}
                        </Alert>
                    ) : (
                        <Alert className="rounded-none border-l-4 border-red-500 bg-red-100 font-medium text-red-800"
                            color={color}>
                            {message}
                        </Alert>
                    )}
                </div>
            }
        </div>
    );
}

export default Popup;


