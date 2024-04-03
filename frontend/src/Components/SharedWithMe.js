import React, { useContext, useEffect } from 'react'
import { context_data } from '../App';

export default function SharedWithMe() {
  const { creatingFolder, setCreatingFolder, setCurrentFolder } = useContext(context_data);

  useEffect(() => {
    setCurrentFolder("shared-with-me");
  }, []);
  return (
    <div>

    </div>
  )
}
