'use client';
import React, { createContext, useCallback, useContext } from 'react';

import { faker } from '@faker-js/faker';

// Visitor model based on react-user-tracker UserEvent.user_metadata
export type Visitor = {
  userId: string;
  name: string;
  email: string;
  location: string;
  device: string;
};

function randomVisitor(): Visitor {
  return {
    userId: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    location: faker.location.country(),
    device: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
  };
}

interface VisitorContextType {
  visitor: Visitor | null;
  setVisitor: (v: Visitor) => void;
  follow: boolean;
  setFollow: (f: boolean) => void;
  resetVisitor: () => void;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const useVisitor = () => {
  const ctx = useContext(VisitorContext);
  if (!ctx) throw new Error('useVisitor must be used within VisitorProvider');
  return ctx;
};

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visitor, setVisitor] = React.useState<Visitor | null>(null);
  const [follow, setFollow] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Only run on client
    const storedVisitor = localStorage.getItem('visitor');
    const storedFollow = localStorage.getItem('follow');
    if (storedVisitor && storedFollow === 'true') {
      setVisitor(JSON.parse(storedVisitor));
      setFollow(true);
    } else {
      setVisitor(randomVisitor());
      setFollow(false);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (!loading) {
      if (follow && visitor) {
        localStorage.setItem('visitor', JSON.stringify(visitor));
        localStorage.setItem('follow', 'true');
      } else {
        localStorage.removeItem('visitor');
        localStorage.setItem('follow', 'false');
      }
    }
  }, [visitor, follow, loading]);

  const resetVisitor = useCallback(() => {
    const newVisitor = randomVisitor();
    setVisitor(newVisitor);
    localStorage.setItem('visitor', JSON.stringify(newVisitor));
  }, []);

  const handleSetFollow = (f: boolean) => {
    setFollow(f);
    if (!f) {
      // No follow: clear visitor and set new visitor
      const newVisitor = randomVisitor();
      setVisitor(newVisitor);
      localStorage.removeItem('visitor');
      localStorage.setItem('follow', 'false');
    } else {
      // Follow: persist current visitor
      localStorage.setItem('visitor', JSON.stringify(visitor));
      localStorage.setItem('follow', 'true');
    }
  };

  return (
    <VisitorContext.Provider
      value={{ visitor, setVisitor, follow, setFollow: handleSetFollow, resetVisitor }}
    >
      {children}
    </VisitorContext.Provider>
  );
};
