import React, { createContext, useContext, useState } from 'react';
import { useServerURL } from './ServerURLContext';

const TherapistProfileContext = createContext();

export const useTherapistProfileContext = () => {
  return useContext(TherapistProfileContext);
};

export const TherapistProfileProvider = ({ children, profileOwner }) => {
  const serverURL = useServerURL();
  const [note, setNote] = useState(null);
  const [behavior, setBehavior] = useState('');
  const [intervention, setIntervention] = useState('');
  const [response, setResponse] = useState('');
  const [plan, setPlan] = useState('');

  return (
    <TherapistProfileContext.Provider 
      value={{ 
          note,
          setNote,
          behavior,
          setBehavior,
          intervention,
          setIntervention,
          response,
          setResponse,
          plan,
          setPlan,
        }}>
      {children}
    </TherapistProfileContext.Provider>
  );
};
