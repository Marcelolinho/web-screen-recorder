import { useState } from 'react';
import Temp from "@/entrypoints/popup/temp.tsx";

function App() {
    const [page, setPage] = useState<'home' | 'temp'>('home');

    if (page === 'temp') {
        return (
            <>
                <button onClick={() => setPage('home')}>Back</button>
                <Temp />
            </>
        );
    }

    return (
        <>
            <h1>WXT + React</h1>
            <button onClick={() => setPage('temp')}>Go to Temp</button>
        </>
    );
}

export default App;