"use client";

import React, { useState } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import ShootingStarCursor from '@/components/ShootingStarCursor';

const Resume = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Replace this with your actual PDF path
  const resumePdfPath = '/Sarvjeet Swanshi.pdf';
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumePdfPath;
    link.download = 'resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handlePdfError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <main className="min-h-screen transition-colors duration-300 relative overflow-hidden bg-black cursor-none">
      <ShootingStarCursor />
      <Navbar loaderComplete={true} />

      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        <div className="max-w-5xl mx-auto w-full flex-grow flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Resume</h1>
              <p className="text-gray-400 mt-2">View and download my professional resume</p>
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transform hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>

          {/* PDF Viewer Container */}
          <div className="flex-grow w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl relative mb-8" style={{ minHeight: '75vh' }}>
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10 w-full h-full">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-white" />
                  <p className="text-gray-300 font-medium">Loading resume...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10 w-full h-full">
                <div className="flex flex-col items-center gap-4 text-center p-8 bg-white/5 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-12 h-12 text-red-400" />
                  <div>
                    <p className="text-white font-medium text-lg">Unable to load PDF directly</p>
                    <p className="text-gray-400 mt-1">Don't worry, you can still download it.</p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>
              </div>
            )}

            {/* PDF Embed */}
            <div className="w-full h-full absolute inset-0">
              <iframe
                src={`${resumePdfPath}#toolbar=0`}
                title="Resume PDF"
                onLoad={handlePdfLoad}
                onError={handlePdfError}
                className="border-none w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Resume;