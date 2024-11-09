import React, { createContext, useContext, useState } from 'react';

interface Subscription {
  levelId: string;
  gradeId: string;
  branchId?: string;
  teacherId: string;
  subjectId: string;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  isSubscribed: (teacherId: string, levelId: string, gradeId: string, subjectId: string, branchId?: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptions: [],
  addSubscription: () => {},
  isSubscribed: () => false,
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    // Demo subscription for Dr. Sarah Johnson's first-year math course
    {
      levelId: 'elementary',
      gradeId: 'first-year',
      teacherId: 'e1-math',
      subjectId: 'math'
    }
  ]);

  const addSubscription = (subscription: Subscription) => {
    setSubscriptions(prev => [...prev, subscription]);
  };

  const isSubscribed = (
    teacherId: string,
    levelId: string,
    gradeId: string,
    subjectId: string,
    branchId?: string
  ) => {
    // Extract the base subject ID without grade prefix
    const baseSubjectId = subjectId.split('-').pop() || '';
    
    return subscriptions.some(sub => {
      const match = 
        sub.teacherId === teacherId &&
        sub.levelId === levelId &&
        sub.gradeId === gradeId &&
        sub.subjectId === baseSubjectId &&
        (!branchId || sub.branchId === branchId);
      
      return match;
    });
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptions, addSubscription, isSubscribed }}>
      {children}
    </SubscriptionContext.Provider>
  );
};