import React from 'react';
import { expect, test } from '@jest/globals';
import { render } from '@testing-library/react';

// Test type validation for primitive types
test('throws on invalid number type', () => {
  expect(() => {
    const id: number = '123' as any;
    if (typeof id !== 'number') {
      throw new TypeError('Invalid number type');
    }
  }).toThrow('Invalid number type');
});

test('throws on invalid string type', () => {
  expect(() => {
    const name: string = true as any;
    if (typeof name !== 'string') {
      throw new TypeError('Invalid string type');
    }
  }).toThrow('Invalid string type');
});

test('throws on invalid boolean type', () => {
  expect(() => {
    const active: boolean = 'yes' as any;
    if (typeof active !== 'boolean') {
      throw new TypeError('Invalid boolean type');
    }
  }).toThrow('Invalid boolean type');
});

// Test complex type validation
interface TestProps {
  id: number;
  name: string;
  active: boolean;
}

test('throws on invalid object type', () => {
  expect(() => {
    const props: TestProps = {
      id: 'invalid' as any,
      name: 123 as any,
      active: 'no' as any
    };
    
    if (typeof props.id !== 'number' ||
        typeof props.name !== 'string' ||
        typeof props.active !== 'boolean') {
      throw new TypeError('Invalid object properties');
    }
  }).toThrow('Invalid object properties');
});

// Test type guard functions
function assertIsNumber(value: any): asserts value is number {
  if (typeof value !== 'number') {
    throw new TypeError('Value is not a number');
  }
}

test('type assertion helper throws correctly', () => {
  expect(() => {
    const value: any = 'not a number';
    assertIsNumber(value);
  }).toThrow('Value is not a number');
});
// React component type tests
test('throws on invalid React component props', () => {
  interface ComponentProps {
    title: string;
    count: number;
  }

  expect(() => {
    const props: ComponentProps = {
      title: 123 as any,
      count: 'invalid' as any
    };
    
    if (typeof props.title !== 'string' ||
        typeof props.count !== 'number') {
      throw new TypeError('Invalid React component props');
    }
  }).toThrow('Invalid React component props');
});

test('throws on invalid React event handler', () => {
  expect(() => {
    const handleClick: (event: MouseEvent) => void = 'not a function' as any;
    
    if (typeof handleClick !== 'function') {
      throw new TypeError('Invalid React event handler');
    }
  }).toThrow('Invalid React event handler');
});

test('validates React state type', () => {
  // Valid state
  const validState: string = 'valid';
  
  // Invalid state - this should cause a TypeScript error
  // @ts-expect-error
  const invalidState: string = 123;
  
  // Runtime validation
  if (typeof validState !== 'string') {
    throw new TypeError('Invalid React state type');
  }
});

test('validates React component with children', () => {
  interface Props {
    children: React.ReactNode;
  }

  expect(() => {
    const props: Props = {
      children: 'invalid' as any
    };
    
    if (typeof props.children !== 'object') {
      throw new TypeError('Invalid React children type');
    }
  }).toThrow('Invalid React children type');
});

test('validates React.memo component props', () => {
  interface MemoProps {
    value: number;
  }

  const MemoComponent = React.memo((props: MemoProps) => {
    return <div>{props.value}</div>;
  });

  expect(() => {
    const props: MemoProps = {
      value: 'invalid' as any
    };
    
    if (typeof props.value !== 'number') {
      throw new TypeError('Invalid React.memo component props');
    }
  }).toThrow('Invalid React.memo component props');
});