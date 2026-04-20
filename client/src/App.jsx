import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ArrowRightLeft, Volume2, Copy, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

function App() {
  const [knText, setKnText] = useState('');
  const [enText, setEnText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (!knText.trim()) return;
    
    setIsTranslating(true);
    setError(null);
    setEnText('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/translate', {
        text: knText
      });
      setEnText(response.data.translation);
    } catch (err) {
      console.error(err);
      setError('Translation failed. Please make sure the backend is running.');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = () => {
    if (!enText) return;
    navigator.clipboard.writeText(enText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="p-6 md:px-12 flex items-center justify-between z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Languages size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">LinguaLink</h1>
            <p className="text-xs text-indigo-300 font-medium tracking-wider">KANNADA TO ENGLISH</p>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 relative">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-5xl"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-6 backdrop-blur-md"
            >
              <Sparkles size={16} />
              AI-Powered Translation
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
              Break Language <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Barriers Instantly
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Translate your Kannada text into fluent English seamlessly with our lightning-fast, highly accurate neural translation engine.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-4 items-center">
            
            {/* Input Panel (Kannada) */}
            <div className="glass-panel p-1 rounded-3xl relative group overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10 hover:border-indigo-500/30">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-transparent pointer-events-none rounded-3xl" />
              <div className="p-5 md:p-6 relative z-10 flex flex-col h-[300px] md:h-[400px]">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Kannada
                  </span>
                </div>
                <textarea
                  value={knText}
                  onChange={(e) => setKnText(e.target.value)}
                  placeholder="ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..."
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-xl md:text-2xl text-slate-200 placeholder:text-slate-600 font-medium"
                  dir="ltr"
                ></textarea>
                
                {/* Character count / Actions */}
                <div className="mt-auto flex items-center justify-between text-slate-500 text-sm">
                  <span>{knText.length} characters</span>
                  {knText && (
                    <button 
                      onClick={() => setKnText('')}
                      className="hover:text-slate-300 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Translate Button Mobile/Desktop */}
            <div className="flex justify-center lg:py-0 relative z-20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTranslate}
                disabled={!knText.trim() || isTranslating}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_40px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:shadow-none transition-all group"
              >
                {isTranslating ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <ArrowRightLeft className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
                )}
              </motion.button>
            </div>

            {/* Output Panel (English) */}
            <div className="glass-panel p-1 rounded-3xl relative group overflow-hidden transition-all duration-300 hover:shadow-purple-500/10 hover:border-purple-500/30">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-transparent pointer-events-none rounded-3xl" />
              <div className="p-5 md:p-6 relative z-10 flex flex-col h-[300px] md:h-[400px]">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    English
                  </span>
                  
                  {enText && (
                    <div className="flex gap-2">
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto w-full font-medium text-xl md:text-2xl text-white">
                  {isTranslating ? (
                    <div className="flex flex-col gap-3 animate-pulse opacity-50">
                      <div className="h-6 bg-slate-700/50 rounded-md w-3/4"></div>
                      <div className="h-6 bg-slate-700/50 rounded-md w-full"></div>
                      <div className="h-6 bg-slate-700/50 rounded-md w-5/6"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-400 text-lg flex items-center h-full justify-center text-center">
                      {error}
                    </div>
                  ) : enText ? (
                    <span className="whitespace-pre-wrap">{enText}</span>
                  ) : (
                    <span className="text-slate-600">Translation will appear here...</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="p-6 text-center text-slate-500 text-sm z-10 relative">
        <p>Built with React, Node.js & Google Translate API.</p>
      </footer>
    </div>
  );
}

export default App;
