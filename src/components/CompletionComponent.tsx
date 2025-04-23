import { Button } from "@/components/ui/button";

const CompletionComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-medium text-center mb-3">You are ready to go!</h1>
      <p className="text-gray-600 text-center text-lg font-medium mb-10">Click the button below to start using Pursuit</p>
      
      <Button className="bg-blue-600 hover:bg-blue-700 min-w-[300px] rounded-md py-6 text-base">
        Go to Dashboard
      </Button>
    </div>
  );
};

export default CompletionComponent; 