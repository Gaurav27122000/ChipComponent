import React, { useEffect, useState } from 'react';
import './App.css';
import ChipComponent from './ChipComponent/ChipComponent';

function App() {
  interface Option {
    name: string;
    email: string;
    avatar: string;
  }
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    // Fetch options from the RandomUser.me API
    fetch('https://randomuser.me/api/?results=50&nat=US')
      .then((response) => response.json())
      .then((data) => {
        const fetchedOptions = data.results.map((result: any) => ({
          name: `${result.name.first} ${result.name.last}`,
          email: result.email,
          avatar: result.picture.thumbnail,
        }));
        setOptions(fetchedOptions);
      })
      .catch((error) => console.error('Error fetching options:', error));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
      <div style={{textAlign: 'center',fontWeight:'bold',marginTop: '10px',marginBottom: '10px',color: 'black'}}>Chip Component</div>
        <ChipComponent options={options} nameKey="name" emailKey="email" imageKey='avatar'/>
      </header>
    </div>
  );
}

export default App;
