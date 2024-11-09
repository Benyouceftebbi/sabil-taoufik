import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface WaitingModalProps {
  onAccepted: () => void;
  onCancel: () => void;
}

export default function WaitingModal({ onAccepted, onCancel }: WaitingModalProps) {
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    // Simulate host accepting after random time (5-15 seconds)
    const timeout = setTimeout(() => {
      onAccepted();
    }, Math.random() * 10000 + 5000);

    // Update wait time every second
    const interval = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [onAccepted]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Waiting for Host
          </h2>
          
          <p className="text-gray-600 mb-6">
            Please wait while the host reviews your request to join the live session.
            <br />
            <span className="text-sm">
              Waiting time: {waitTime} seconds
            </span>
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((waitTime / 15) * 100, 100)}%` }}
            ></div>
          </div>
          
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Cancel Request
          </button>
        </div>
      </div>
    </div>
  );
}