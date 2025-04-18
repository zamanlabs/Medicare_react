import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faPhone } from '@fortawesome/free-solid-svg-icons';

const EmergencyAlertModal = ({ isVisible, onDismiss }) => {
    if (!isVisible) {
        return null;
    }

    const handleCall999 = () => {
        window.location.href = 'tel:999';
    };

    // Prevent background scroll when modal is open
    React.useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        // Cleanup function to reset overflow when component unmounts or visibility changes
        return () => {
            document.body.style.overflow = '';
        };
    }, [isVisible]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-scaleIn">
                {/* Header */}
                <div className="bg-red-600 text-white p-4 flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3 text-xl" />
                    <h3 className="text-lg font-semibold">Medical Emergency Alert</h3>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-700 mb-4">
                        It appears you may be describing a medical emergency. If you or someone else is experiencing a life-threatening situation, please call emergency services immediately.
                    </p>
                    <p className="text-gray-800 font-medium mb-6">
                        Do not wait for a response from this chat. Medical emergencies require immediate professional attention.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={handleCall999}
                            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md flex items-center justify-center font-medium transition-colors duration-200 order-1 sm:order-2"
                        >
                            <FontAwesomeIcon icon={faPhone} className="mr-2" />
                            Call 999
                        </button>
                        <button
                            onClick={onDismiss}
                            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors duration-200 order-2 sm:order-1"
                        >
                            I understand, dismiss
                        </button>
                    </div>
                </div>
            </div>
            {/* Basic CSS for animations (add to index.css or a global CSS file) */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-scaleIn {
                     animation: scaleIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default EmergencyAlertModal; 