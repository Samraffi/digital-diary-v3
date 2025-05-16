import React, { useState, MouseEvent } from 'react';

interface User {
  name: string;
  age: number;
  fullName: string;
}

interface UserProfileProps {
  user: User;
  onUpdate: (name: string) => void;
}

const UserProfile = ({ user, onUpdate }: UserProfileProps) => {
  const [count, setCount] = useState(0);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setCount(count + 1);
    onUpdate(user.name);
  };

  const getUserDetails = (): JSX.Element => {
    return (
      <div>
        <p>Name: {user.name}</p>
        <p>Age: {user.age}</p>
      </div>
    );
  };

  return (
    <div>
      <h1>{user.fullName}</h1>
      <p>Age: {user.age}</p>
      <button onClick={handleClick}>
        Clicked {count} times
      </button>
      {getUserDetails()}
    </div>
  );
};

const App = () => {
  const user = {
    name: 'John Doe',
    age: 30,
    fullName: 'John Doe'
  };

  return (
    <UserProfile 
      user={user}
      onUpdate={(name: string) => console.log(name)}
    />
  );
};

export default App;