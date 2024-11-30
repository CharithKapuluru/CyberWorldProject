import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import { Play } from 'lucide-react';

const CodeCompiler = () => {
  const [code, setCode] = useState(`// JavaScript Example
const number = 7;

// Checking if the number is even or odd
if (number % 2 === 0) {
    console.log(\`\${number} is an even number.\`);
} else {
    console.log(\`\${number} is an odd number.\`);
}`);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python3', name: 'Python' },
    { id: 'cpp', name: 'C++' }
  ];

  const getCompilerLanguage = (selectedLang) => {
    const langMap = {
      'javascript': 'nodejs',
      'python3': 'python3',
      'cpp': 'cpp'
    };
    return langMap[selectedLang] || selectedLang;
  };

  const compileCode = async () => {
    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'e346ed7d79msh8a7eab3192b1d2dp106d09jsn5abf23d48923',
          'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
        },
        body: JSON.stringify({
          language: getCompilerLanguage(language),
          version: 'latest',
          code: code,
          input: null
        })
      };

      const response = await fetch('https://online-code-compiler.p.rapidapi.com/v1/', options);
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else if (result.output) {
        setOutput(result.output.trim());
      } else if (result.stderr) {
        setError(result.stderr);
      } else {
        setOutput('Code executed successfully but produced no output.');
      }
    } catch (err) {
      setError('Failed to compile code. Please try again: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Code Compiler</h1>
        
        <div className="flex gap-2 mb-4">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setOutput('');
              setError(null);
            }}
            className="bg-white text-black px-4 py-2 rounded-md focus:outline-none appearance-normal min-w-[150px]"
          >
            {languages.map((lang) => (
              <option 
                key={lang.id} 
                value={lang.id}
              >
                {lang.name}
              </option>
            ))}
          </select>
          
          {/* Run Button */}
          <button
            onClick={compileCode}
            disabled={isLoading}
            className="flex items-center gap-2 bg-[rgba(255,255,255,0.2)] text-white px-6 py-2 rounded-md"
            style={{
              backgroundColor: 'rgba(211, 211, 211, 0.2)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Play className="w-5 h-5" />
            {isLoading ? 'Running...' : 'Run Code'}
          </button>
        </div>

        <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
          <Editor
            height="600px"
            defaultLanguage={language}
            language={language === 'python3' ? 'python' : language}
            theme="vs-dark"
            value={code}
            onChange={setCode}
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
              roundedSelection: false,
              cursorStyle: 'line',
              padding: { top: 20 }
            }}
          />
        </div>

        {(output || error) && (
          <div className="mt-4 bg-[#1e1e1e] rounded-lg p-6">
            <h2 className="text-xl text-white mb-4">Output</h2>
            {error ? (
              <pre className="text-red-400 font-mono whitespace-pre-wrap">{error}</pre>
            ) : (
              <pre className="text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeCompiler;