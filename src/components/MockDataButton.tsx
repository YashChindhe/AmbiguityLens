'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';

interface MockDataButtonProps {
  onFillForm: (data: { imageUrl: string; command: string }) => void;
}

const MOCK_DATASETS = [
  {
    name: 'Clear Command',
    imageUrl: '/mock-images/clear-command.jpg',
    command: 'Pick up the red cube from the table and place it in the bin'
  },
  {
    name: 'Ambiguous Command',
    imageUrl: '/mock-images/ambiguous-command.jpg',
    command: 'Move around the area and grab approximately something'
  },
  {
    name: 'Too Short',
    imageUrl: '/mock-images/too-short.jpg',
    command: 'Go'
  },
  {
    name: 'Too Complex',
    imageUrl: '/mock-images/too-complex.jpg',
    command: 'Pick this thing up and move it to that place over there and then open the gripper and close it and rotate it and do other things'
  },
  {
    name: 'Robotic Movement',
    imageUrl: '/mock-images/robotic-movement.jpg',
    command: 'Rotate the gripper 90 degrees clockwise and hold for 3 seconds'
  },
];

export function MockDataButton({ onFillForm }: MockDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDataset = (dataset: typeof MOCK_DATASETS[0]) => {
    onFillForm({
      imageUrl: dataset.imageUrl,
      command: dataset.command,
    });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 hover:shadow-lg"
        title="Load demo data to test the auditor"
      >
        <Zap className="w-4 h-4" />
        <span>Mock Data</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl z-50 max-w-sm w-48">
          <div className="p-1">
            {MOCK_DATASETS.map((dataset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectDataset(dataset)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  {dataset.name}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-1 truncate">
                  "{dataset.command}"
                </div>
              </button>
            ))}
          </div>

          {/* Dropdown indicator */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-white dark:bg-gray-900 rotate-45 border-l border-t border-gray-300 dark:border-gray-700"></div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
