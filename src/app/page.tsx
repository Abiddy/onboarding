"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import CompanyProfileComponent from "@/components/CompanyProfileComponent";
import PersonasComponent from "@/components/PersonasComponent";
import AuthorityLevelsComponent from "@/components/AuthorityLevelsComponent";
import InviteUsersComponent from "@/components/InviteUsersComponent";
import CompletionComponent from "@/components/CompletionComponent";

// Define all steps in the onboarding process
const STEPS = ["company-profile", "personas", "authority-levels", "invite-users"];
const STEP_NAMES = {
  "company-profile": "Company profile",
  "personas": "Personas",
  "authority-levels": "Authority levels",
  "invite-users": "Invite users"
};

// Define form data structure type
interface FormDataType {
  "company-profile": {
    companyName: string;
    website: string;
    industry: string;
    prompt: string;
    keywords: string[];
  };
  "personas": {
    selectedPersona: string | null;
    hasPersonas: boolean;
  };
  "authority-levels": {
    selectedLevel: string | null;
    hasLevels: boolean;
  };
  "invite-users": {
    invitedUsers: string[];
  };
}

export default function Home() {
  // Start at the first step without any completed steps
  const [currentStep, setCurrentStep] = useState<string>(STEPS[0]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCompletionPage, setShowCompletionPage] = useState<boolean>(false);
  
  // Form data state to track required fields
  const [formData, setFormData] = useState<FormDataType>({
    "company-profile": {
      companyName: "",
      website: "",
      industry: "",
      prompt: "",
      keywords: []
    },
    "personas": {
      selectedPersona: null,
      hasPersonas: false
    },
    "authority-levels": {
      selectedLevel: null,
      hasLevels: false
    },
    "invite-users": {
      invitedUsers: []
    }
  });
  
  // Step validation rules
  const isStepValid = (step: string): boolean => {
    switch(step) {
      case "company-profile":
        return !!formData["company-profile"].companyName && 
               !!formData["company-profile"].website && 
               !!formData["company-profile"].industry;
      case "personas":
        return formData["personas"].hasPersonas;
      case "authority-levels":
        return formData["authority-levels"].hasLevels;
      case "invite-users":
        return true; // Optional step
      default:
        return false;
    }
  };
  
  // Calculate progress as percentage of completed steps
  const progress = Math.round((completedSteps.length / STEPS.length) * 100);
  
  // Handle form data updates from child components
  const updateFormData = useCallback((step: keyof FormDataType, data: Partial<FormDataType[keyof FormDataType]>) => {
    setFormData(prev => {
      // Type assertion to handle index access
      const updatedStep = { ...prev[step], ...data };
      return {
        ...prev,
        [step]: updatedStep
      };
    });
  }, []);
  
  // Handle navigation to next step
  const handleNext = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    
    // Only proceed if current step is valid
    if (isStepValid(currentStep)) {
      // Add current step to completed steps if not already there
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      // Move to next step if available
      if (currentIndex < STEPS.length - 1) {
        setCurrentStep(STEPS[currentIndex + 1]);
      } else {
        setShowCompletionPage(true);
      }
    }
  };
  
  // Handle navigation to a specific step
  const goToStep = (step: string) => {
    const stepIndex = STEPS.indexOf(step);
    const previousSteps = STEPS.slice(0, stepIndex);
    const canNavigate = previousSteps.every(step => completedSteps.includes(step));
    
    if (canNavigate || completedSteps.includes(step)) {
      setCurrentStep(step);
      setShowCompletionPage(false);
    }
  };

  // Get the component for the current step with props for form data
  const getCurrentComponent = () => {
    if (showCompletionPage) return <CompletionComponent />;
    
    const stepComponents = {
      "company-profile": (
        <CompanyProfileComponent 
          data={formData["company-profile"]}
          updateData={(data) => updateFormData("company-profile", data)}
        />
      ),
      "personas": (
        <PersonasComponent 
          data={formData["personas"]}
          updateData={(data) => updateFormData("personas", data)}
        />
      ),
      "authority-levels": (
        <AuthorityLevelsComponent 
          data={formData["authority-levels"]}
          updateData={(data) => updateFormData("authority-levels", data)}
        />
      ),
      "invite-users": (
        <InviteUsersComponent 
          data={formData["invite-users"]}
          updateData={(data) => updateFormData("invite-users", data)}
        />
      )
    } as const;
    
    return stepComponents[currentStep as keyof typeof stepComponents] || null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Panel with header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center">
        <div className="w-16 flex justify-center">
          <img src="/logo.png" alt="Pursuit" className="h-6 w-6" />
        </div>
        <div className="h-full w-px bg-gray-200"></div>
        <span className="font-semibold text-gray-800 ml-4">Onboarding</span>
        <div className="ml-auto mr-6">
          <span className="text-sm text-gray-500">{progress}% Complete</span>
        </div>
      </div>
      
      <div className="flex flex-1">
        {/* Left sidebar with logo and navigation */}
        <div className="w-16 bg-gray-20 border-r flex flex-col items-center py-6"></div>

        {/* Onboarding layout */}
        <div className="flex flex-1">
          {/* Left sidebar with steps */}
          {!showCompletionPage && (
            <div className="w-[260px] border-r p-6">
              <div className="bg-white rounded-md overflow-hidden">
                <nav>
                  {STEPS.map((step, index) => {
                    const isActive = currentStep === step;
                    const isCompleted = completedSteps.includes(step);
                    const stepIndex = STEPS.indexOf(step);
                    const previousStepsCompleted = STEPS.slice(0, stepIndex).every(s => completedSteps.includes(s));
                    const isClickable = previousStepsCompleted || isCompleted;
                    
                    return (
                      <div 
                        key={step} 
                        className={`flex items-center gap-2 py-2.5 px-4 rounded-md text-sm ${
                          isActive ? 'bg-gray-100' : ''
                        } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} `}
                        onClick={() => isClickable && goToStep(step)}
                      >
                        {isCompleted ? (
                          <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : isActive ? (
                          <div className="h-4 w-4 rounded-full border-1 border-blue-500 flex items-center justify-center">
                          </div>
                        ) : (
                          <div className="h-4 w-4 rounded-full border-1 border-blue-500 flex items-center justify-center"></div>
                        )}
                        <span className={isActive ? "text-grey-600 font-medium" : "text-gray-600"}>
                          {STEP_NAMES[step as keyof typeof STEP_NAMES]}
                        </span>
                      </div>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 bg-white">
            <div className="max-w-full px-16 py-8">
              {getCurrentComponent()}
              
              {!showCompletionPage && (
                <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between">
                  {currentStep === STEPS[0] ? (
                    <div></div> // Empty div for spacing on first step
                  ) : (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        const currentIndex = STEPS.indexOf(currentStep);
                        if (currentIndex > 0) {
                          setCurrentStep(STEPS[currentIndex - 1]);
                        }
                      }}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Go back
                    </Button>
                  )}
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="ghost"
                      className="text-gray-600 hover:text-gray-900 text-sm"
                    >
                      Skip
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 text-sm"
                      onClick={handleNext}
                      disabled={!isStepValid(currentStep)}
                    >
                      {currentStep === STEPS[STEPS.length - 1] ? "Complete" : (
                        <>
                          Next
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
