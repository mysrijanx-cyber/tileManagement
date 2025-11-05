   
import React from 'react';
import { Palette, Home, Square, CheckCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { trackTileApplication } from '../lib/firebaseutils';

export const TileApplication: React.FC = () => {
  const { selectedTile, selectedRoom, appliedTiles, applyTileToSurface, currentShowroom } = useAppStore();

  const handleApplyTile = (surface: string) => {
    if (selectedTile && selectedRoom && currentShowroom) {
      applyTileToSurface(surface, selectedTile.id);
      trackTileApplication(selectedTile.id, currentShowroom.id, surface, selectedRoom.type);
    }
  };

  if (!selectedTile || !selectedRoom) {
    return (
     <>
     </>
    );
  }

  const surfaces = selectedRoom.type === 'hall' 
    ? ['floor'] 
    : ['floor', 'wall'];

  const canApplyToSurface = (surface: string) => {
    if (surface === 'floor') {
      return selectedTile.category === 'floor' || selectedTile.category === 'both';
    }
    if (surface === 'wall') {
      return selectedTile.category === 'wall' || selectedTile.category === 'both';
    }
    return false;
  };

  // Determine current step and guidance
  const getStepGuidance = () => {
    if (selectedRoom.type === 'hall') {
      return {
        currentStep: 1,
        totalSteps: 1,
        message: "Apply tile to floor",
        completed: !!appliedTiles.floor
      };
    }
    
    // For washroom and kitchen
    const hasFloor = !!appliedTiles.floor;
    const hasWall = !!appliedTiles.wall;
    
    if (!hasFloor) {
      return {
        currentStep: 1,
        totalSteps: 2,
        message: "First, select and apply a floor tile",
        completed: false
      };
    } else if (!hasWall) {
      return {
        currentStep: 2,
        totalSteps: 2,
        message: "Now select and apply a wall tile",
        completed: false
      };
    } else {
      return {
        currentStep: 2,
        totalSteps: 2,
        message: "Room design completed! You can change tiles anytime.",
        completed: true
      };
    }
  };

  const stepGuidance = getStepGuidance();
  const isMultiStep = selectedRoom.type !== 'hall';

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Apply Tile</h3>
      </div>

      {/* Step Guidance - RESPONSIVE */}
      {isMultiStep && (
        <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border-2 ${
          stepGuidance.completed 
            ? 'bg-green-50 border-green-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            {stepGuidance.completed ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  stepGuidance.completed ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {stepGuidance.currentStep}
                </div>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            )}
            <span className={`text-xs sm:text-sm font-medium ${
              stepGuidance.completed ? 'text-green-800' : 'text-blue-800'
            }`}>
              Step {stepGuidance.currentStep} of {stepGuidance.totalSteps}
            </span>
          </div>
          <p className={`text-xs sm:text-sm ${
            stepGuidance.completed ? 'text-green-700' : 'text-blue-700'
          }`}>
            {stepGuidance.message}
          </p>
          
          {/* Progress bar for multi-step - RESPONSIVE */}
          <div className="mt-2 sm:mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div 
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  stepGuidance.completed ? 'bg-green-600' : 'bg-blue-600'
                }`}
                style={{ width: `${(stepGuidance.currentStep / stepGuidance.totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Tile Preview - RESPONSIVE */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={selectedTile.imageUrl}
            alt={selectedTile.name}
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-cover rounded-lg flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
              {selectedTile.name}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600">{selectedTile.size}</p>
          </div>
        </div>
      </div>

      {/* Surface Application Buttons - RESPONSIVE */}
      <div className="space-y-3 sm:space-y-4">
        {surfaces.map((surface) => {
          const isFloorStep = surface === 'floor';
          const isWallStep = surface === 'wall';
          const shouldDisableWall = isWallStep && !appliedTiles.floor;
          const isCurrentStep = (isFloorStep && !appliedTiles.floor) || 
            (isWallStep && appliedTiles.floor && !appliedTiles.wall);
          
          return (
            <div key={surface} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 sm:p-4 border rounded-lg transition-all ${
              shouldDisableWall 
                ? 'border-gray-200 bg-gray-50 opacity-60' 
                : isCurrentStep 
                  ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-200' 
                  : appliedTiles[surface] 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 bg-white hover:border-blue-300'
            }`}>
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Square className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-medium capitalize">{surface}</span>
                    {appliedTiles[surface] && (
                      <span className="text-xs sm:text-sm text-green-600 bg-green-100 px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Applied
                      </span>
                    )}
                  </div>
                  {shouldDisableWall && (
                    <p className="text-xs text-gray-500 mt-1">Apply floor tile first</p>
                  )}
                  {isCurrentStep && !shouldDisableWall && (
                    <p className="text-xs text-blue-600 mt-1">← Current step</p>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleApplyTile(surface)}
                disabled={!canApplyToSurface(surface) || shouldDisableWall}
                className={`
                  w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base
                  ${canApplyToSurface(surface) && !shouldDisableWall
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {appliedTiles[surface] === selectedTile.id ? 'Applied' : 'Apply'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Warning Message - RESPONSIVE */}
      {!surfaces.some(surface => canApplyToSurface(surface)) && !stepGuidance.completed && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-xs sm:text-sm">
            This tile is not suitable for any surfaces in the selected room type.
            {selectedRoom.type !== 'hall' && (
              <span className="block mt-1">
                Try selecting a tile with "Floor & Wall" or "{surfaces.find(s => !appliedTiles[s]) === 'floor' ? 'Floor' : 'Wall'} Only" category.
              </span>
            )}
          </p>
        </div>
      )}
      
      {/* Completion Message - RESPONSIVE */}
      {stepGuidance.completed && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium text-xs sm:text-sm">Room design completed!</p>
          </div>
          <p className="text-green-700 text-xs sm:text-sm mt-1">
            You can select different tiles to change the floor or wall design anytime.
          </p>
        </div>
      )}
    </div>
  );
};