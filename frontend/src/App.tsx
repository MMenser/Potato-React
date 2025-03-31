import { useEffect, useState } from 'react'
import './styles.css'
import Box from './components/box'
function App() {

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-start">
      <div className='w-full h-screen flex flex-col p-10 space-y-6 text-black">'>
      <Box id={1}></Box>
      <Box id={2}></Box>
      <Box id={3}></Box>
      <Box id={4}></Box>
      </div>
    </div>
  );
}

export default App
