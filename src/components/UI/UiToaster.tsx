import React from 'react';
import toast, { Toaster as OrgToaster } from 'react-hot-toast';

export function UIToaster() {
    return (
        <div className="toaser">
            <OrgToaster
                position="bottom-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    // Default options for specific types
                    success: {
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
        </div>
    );
}

export const toastWarning: typeof toast.custom = (message, options) => {
    return toast(message,
        {...{ style: { backgroundColor: 'tomato' } }, ...options}
    );
};
