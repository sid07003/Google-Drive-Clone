import React, { useContext, useEffect } from 'react'
import { context_data } from '../App';

export default function HomePage() {
  const { creatingFolder, setCreatingFolder, setCurrentFolder } = useContext(context_data);

  useEffect(() => {
    setCurrentFolder("home");
  }, []);
  return (
    <div>

    </div>
  )
}
