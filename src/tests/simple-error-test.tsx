import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState<number>('0'); // Ошибка: строка вместо числа
  
  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Увеличить
      </button>
    </div>
  );
};

export default Counter;
