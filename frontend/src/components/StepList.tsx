import React from 'react';
import type { Step } from '../types';
import { FaCheck, FaClock, FaTruckLoading } from 'react-icons/fa';

interface StepListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

function StepList({ steps, currentStep, onStepClick }: StepListProps) {
  return (
   <div className='w-1/3 bg-gray-900/50 h-full overflow-auto '>
    <h2 className='text-lg font-semibold mb-4 text-gray-100'>Build Steps</h2>
    <div className='space-y-4'>
      {steps.map((step)=>(
        <div key={step.id} className={`p-1 rounded-lg cursor-pointer transition-colors ${currentStep===step.id ? 'bg-gray-800} border border-gray-700':'hover:bg-gray-800'}`}
        onClick={()=>onStepClick(step.id)}>

          <div className='flex items-center gap-2'>
            {step.status === 'completed' ? (
                <FaCheck className="w-5 h-5 text-green-500" />
              ) : step.status === 'in-progress' ? (
                <FaClock className="w-5 h-5 text-blue-400" />
              ) : (
                <FaTruckLoading className="w-5 h-5 text-gray-600" />
              )}
              <h3 className="font-medium text-gray-100">{step.title}</h3>
            </div>
            <p className="text-sm text-gray-400 mt-2">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepList;