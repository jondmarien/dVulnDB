import { createContext } from 'react';
import { Route } from 'react-router-dom';

function TestPageComponent() {
  const ctx = createContext(null);
  return <div>TestPage</div>;
}

export default function TestPageRoute() {
  return (
    <Route path="/test" element={<TestPageComponent />} />
  );
}