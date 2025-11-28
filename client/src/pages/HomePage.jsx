import React from 'react';
import { Link } from 'react-router-dom';
import { Diamond, ArrowRight, CheckCircle, Users, Settings, FileText, MessageSquare } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "cursive" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header className="flex justify-between  items-center p-6 border-b border-gray-800">
        <div className="text-3xl font-bold text-white">superagent</div>

        <div className='flex gap-5'>
        <button  className="px-4 py-2  cursor-pointer border-1 text-white rounded-lg text-lg transition-colors">
          <Link to="/login">login</Link>
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-lg text-lg hover:bg-blue-700 transition-colors">
          <Link to="/register-form">Create account</Link>
        </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Solve Technical Problems with Agent
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Turn high performing engineers scientists and problem makers with guidance on development 
            and implementation of cutting edge AI solutions
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
            View Examples
          </button>
        </div>

        {/* Trusted Companies */}
        <div className="text-center mb-16">
          <h2 className="text-2xl text-gray-400 mb-8">TRUSTED COMPANIES</h2>
          <div className="flex justify-center items-center space-x-12 text-xl text-gray-500">
            <span>ChatGPT</span>
            <span>Anthropic</span>
            <span>Microsoft</span>
            <span>PostMan</span>
            <span>MongoDB</span>
            <span>Apple</span>
            <span>Meta</span>
            <span>Google</span>
          </div>
          <p className="text-lg text-gray-400 mt-6">Behind the scenes Workflows</p>
        </div>

        {/* Problem Statement Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold mb-4">Write your problem statement</h3>
            <p className="text-xl text-gray-300 mb-6">Define your skills and description</p>
            
            <div className="space-y-4">
              <button className="w-full p-4 border border-gray-600 rounded-lg text-left hover:border-blue-500 transition-colors">
                <span className="text-lg text-blue-400">Database problem</span>
              </button>
              <button className="w-full p-4 border border-gray-600 rounded-lg text-left hover:border-blue-500 transition-colors flex items-center justify-between">
                <span className="text-lg text-blue-400">AI-Related Solutions</span>
                <Diamond className="w-6 h-6 text-blue-400" />
              </button>
            </div>
          </div>

          {/* Workflow Diagram */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <h4 className="text-2xl font-bold mb-8 text-center">Workflow Process</h4>
            
            {/* First Flow */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gray-800 px-6 py-3 rounded-lg border border-gray-600">
                  <span className="text-lg">User Analysis</span>
                </div>
                <ArrowRight className="w-8 h-8 text-blue-400" />
                <div className="bg-blue-900 px-6 py-3 rounded-lg border border-blue-600">
                  <span className="text-lg">Request</span>
                </div>
                <ArrowRight className="w-8 h-8 text-blue-400" />
                <div className="bg-gray-800 px-6 py-3 rounded-lg border border-gray-600">
                  <span className="text-lg">Develop Solution while analyzing technical aspects</span>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-green-900 px-6 py-3 rounded-lg border border-green-600 inline-block">
                  <span className="text-lg">moderator</span>
                </div>
              </div>
            </div>

            {/* Second Flow */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gray-800 px-6 py-3 rounded-lg border border-gray-600">
                  <span className="text-lg">Start Coding/Scripting</span>
                </div>
                <ArrowRight className="w-8 h-8 text-blue-400" />
                <div className="bg-blue-900 px-6 py-3 rounded-lg border border-blue-600">
                  <span className="text-lg">Request</span>
                </div>
                <ArrowRight className="w-8 h-8 text-blue-400" />
                <div className="bg-gray-800 px-6 py-3 rounded-lg border border-gray-600">
                  <span className="text-lg">Technical Analysis through conversation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Enhanced Process */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <h4 className="text-2xl font-bold mb-8">Enhanced Process Flow</h4>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-600">
                  <span className="text-lg">Auto Analysis</span>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-400" />
                <div className="bg-blue-900 px-4 py-2 rounded-lg border border-blue-600">
                  <span className="text-lg">Higher-Level thinking using advanced reasoning</span>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-purple-900 px-4 py-2 rounded-lg border border-purple-600 inline-block">
                  <span className="text-lg">moderator (reviewing implementation)</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-blue-400 mt-6">Advanced tool working in real workflow</p>
          </div>

          {/* Right: Automation Tools */}
          <div className="space-y-6">
            <h4 className="text-2xl font-bold">Automation and workflow tools via frameworks</h4>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Moderator Tool */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <h5 className="text-xl font-bold mb-4 text-blue-400">Moderator tool</h5>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-lg">Use the new tool</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <span className="text-lg">Tool</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-lg">moderator</span>
                  </div>
                </div>
              </div>

              {/* User Tool */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <h5 className="text-xl font-bold mb-4 text-purple-400">User tool</h5>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-400" />
                    <span className="text-lg">Use the coordination tool</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <span className="text-lg">coordination</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-lg">workflow</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-gray-300">Live implementation with moderator for solving problems</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 mb-8">
          <p className="text-lg text-gray-500 mb-8">powered by superagent</p>
          <div className="text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SUPERAGENT
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage

