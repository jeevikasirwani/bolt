import React, { useState } from 'react';
import type { Step } from '../types';
import { FaChevronDown } from 'react-icons/fa';

interface StepListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

function StepList({ steps, currentStep, onStepClick }: StepListProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-w-[220px] max-w-xs w-full p-2 bg-slate-900/90 rounded-lg shadow-lg break-words">
      <div
        className="flex items-center justify-between cursor-pointer select-none mb-2"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-lg font-semibold text-gray-100">Build Steps</span>
        <FaChevronDown
          className={`w-5 h-5 text-gray-300 transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`}
        />
      </div>
      {open && (
        <div className="space-y-4 overflow-y-auto max-h-[60vh] 
          [&::-webkit-scrollbar]:hidden
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-track]:backdrop-blur-sm
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          {steps.map((step, idx) => (
            <div
              key={`${step.id}-${step.title}-${idx}`}
              onClick={() => onStepClick(step.id)}
              className={`p-4 rounded-lg cursor-pointer select-none ${
                step.id === currentStep
                  ? 'bg-blue-500/20 border border-blue-500'
                  : 'bg-gray-800 border border-gray-700'
              }`}
            >
              <h3 className="text-lg font-medium text-gray-100 break-words">{step.title}</h3>
              <p className="text-gray-400 break-words">{step.description}</p>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    step.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : step.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {step.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StepList;