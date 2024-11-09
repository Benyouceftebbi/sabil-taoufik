import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import WaitingModal from './WaitingModal';
import { useSubscription } from '../context/SubscriptionContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: string;
}

export default function AuthModal({ isOpen, onClose, contentType }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showWaiting, setShowWaiting] = useState(false);
  const navigate = useNavigate();
  const { isSubscribed } = useSubscription();
  const { levelId } = useParams<{ levelId: string }>();

  if (!isOpen) return null;

  // Parse content type to get teacher ID
  const [type, contentId] = contentType.split('/');
  const teacherId = contentId?.split('-')[0];

  // Extract grade and subject from the path
  const pathParts = window.location.pathname.split('/');
  const levelIndex = pathParts.indexOf('level');
  const subjectIndex = pathParts.indexOf('subject');
  
  const gradeId = pathParts[levelIndex + 2] || '';
  const fullSubjectId = pathParts[subjectIndex + 1] || '';
  
  // Parse subject ID to get branch and base subject
  const subjectParts = fullSubjectId.split('-');
  const branchId = subjectParts.length === 3 ? subjectParts[1] : undefined;
  const subjectId = subjectParts[subjectParts.length - 1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    // First check credentials
    if (email === 'admin@admin.com' && password === '12345678') {
      // Then check subscription
      const hasSubscription = isSubscribed(teacherId || '', levelId || '', gradeId, subjectId, undefined);
  
      if (!hasSubscription) {
        setError('You need to subscribe to this teacher\'s course to access their content.');
        return;
      }

      // If all checks pass, proceed with content access
      if (type === 'stream') {
        setShowWaiting(true);
      } else {
        onClose();
        navigate(`/watch/${contentType}`);
      }
    } else {
      setError('Invalid email or password');
    }
  };

  const handleHostAccept = () => {
    onClose();
    navigate(`/watch/${contentType}`);
  };

  if (showWaiting) {
    return (
      <WaitingModal
        onAccepted={handleHostAccept}
        onCancel={() => {
          setShowWaiting(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Sign in to {type === 'stream' ? 'join live stream' : 'watch recording'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign In
          </button>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="text-purple-600 hover:text-purple-500">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}