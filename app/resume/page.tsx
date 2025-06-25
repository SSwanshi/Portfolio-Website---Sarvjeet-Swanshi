"use client";

import React, { useState } from 'react';
import { Download, FileText, Loader2, AlertCircle } from 'lucide-react';

const Resume = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Replace this with your actual PDF path
  const resumePdfPath = '/Resume - Sarvjeet Swanshi.pdf';
  
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" 
         style={{ 
           background: 'linear-gradient(45deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))' 
         }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Resume - Sarvjeet Swanshi</h1>
                <p className="text-gray-600">View and download my resume</p>
              </div>
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                  <p className="text-gray-600">Loading resume...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                  <div>
                    <p className="text-gray-800 font-medium">Unable to load PDF</p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    Try Download Instead
                  </button>
                </div>
              </div>
            )}

            {/* PDF Embed */}
            <div className="w-full" style={{ height: '80vh' }}>
              <embed
                src={resumePdfPath}
                type="application/pdf"
                width="100%"
                height="100%"
                onLoad={handlePdfLoad}
                onError={handlePdfError}
                className="border-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50/80 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Professional Resume - PDF Format</span>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            <strong>Note:</strong> 
            If the PDF doesn&apos;t display, you can still download it using the download button.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resume;