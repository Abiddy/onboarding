import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KeywordInput from "@/components/ui/KeywordInput";

interface AuthorityLevelsData {
  selectedLevel: string | null;
  hasLevels: boolean;
}

interface AuthorityLevelsProps {
  data: AuthorityLevelsData;
  updateData: (data: Partial<AuthorityLevelsData>) => void;
}

const AuthorityLevelsComponent = ({ data, updateData }: AuthorityLevelsProps) => {
  // Use the selectedLevel from props if available, otherwise default to "C Level"
  const [selectedLevel, setSelectedLevel] = useState<string>(data.selectedLevel || "C Level");
  
  const authorityLevels = [
    { name: "C Level", count: 537966 },
    { name: "Director", count: 821094 },
    { name: "Manager", count: 312398 },
    { name: "Individual Contributor", count: 538732 },
    { name: "Gatekeeper", count: 34206 },
  ];
  
  // Update parent component when selection changes
  useEffect(() => {
    // Using a stable reference to the updateData function to prevent infinite loops
    const updateParent = () => {
      updateData({
        selectedLevel,
        hasLevels: selectedLevel !== null
      });
    };
    
    updateParent();
  }, [selectedLevel]); // Removed updateData from dependencies
  
  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Authority levels</h1>
          <p className="text-gray-500 mt-2">You will be able to filter Pursuit data by Authority levels</p>
        </div>
        {selectedLevel && (
          <div>
            <Button 
              variant="destructive" 
              className="rounded-md"
              onClick={() => setSelectedLevel("")}
            >
              Delete authority level
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column - Authority level setup */}
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input placeholder="Authority Level" className="w-full" />
            <p className="text-xs text-gray-500 mt-1">Assign a title to this custom filter</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Key
            </label>
            <Input placeholder="authority_level" className="w-full" />
            <p className="text-xs text-gray-500 mt-1">Key field that will appear in your connected CRM</p>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Authority levels (5)</h3>
              <Button variant="ghost" className="text-blue-500 text-sm p-0 h-auto hover:bg-transparent hover:text-blue-600">+ Create new authority level</Button>
            </div>
            
            {/* List of authority levels */}
            <div className="space-y-2">
              {authorityLevels.map((level, index) => (
                <div 
                  key={index} 
                  className={`border ${selectedLevel === level.name ? 'border-blue-100 bg-blue-50' : 'border-gray-200'} rounded-md p-3 flex justify-between items-center cursor-pointer`}
                  onClick={() => setSelectedLevel(level.name)}
                >
                  <span className={selectedLevel === level.name ? "font-medium" : ""}>{level.name}</span>
                  <span className="text-sm text-gray-500">{level.count.toLocaleString()} Contacts found →</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
            >
              Create new authority level
            </Button>
          </div>
        </div>
        
        {/* Right column - Item settings */}
        {selectedLevel && (
          <div>
            <h2 className="text-lg font-medium mb-4">Item settings</h2>
            <div className="text-sm text-gray-500 mb-6">
              <span className="bg-gray-100 px-2 py-1 rounded">
                <span className="text-gray-500">{authorityLevels.find(l => l.name === selectedLevel)?.count.toLocaleString()} Contacts meet criteria</span>
              </span>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Value
              </label>
              <Input defaultValue={selectedLevel} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">Value that will appear in your connected CRM</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Filters</h3>
              <p className="text-xs text-gray-500 mb-3">Choose the filters you want to apply</p>
              
              <div className="flex mb-3">
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-md bg-white">Contacts</Button>
                  <Button variant="outline" className="rounded-md bg-gray-50">Entities</Button>
                </div>
              </div>
              
              {/* Filter rows */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Select defaultValue="title">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Title" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="contains">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Contains" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contains</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="ghost" className="px-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </Button>
                  </div>
                  
                  <KeywordInput
                    category="authority_title_filters"
                    placeholder="Type and hit enter..."
                    initialKeywords={[
                      "Chief",
                      "Mayor",
                      "Council",
                      "CIO",
                      "CFO",
                      "CISO",
                      "CEO",
                      "Executive"
                    ]}
                  />
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">AND</span>
                  <Button variant="outline" className="bg-blue-100 text-blue-800 rounded h-6 px-2 py-0 text-xs">OR</Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Select defaultValue="department">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="department">Department</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="contains">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Contains" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contains</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="ghost" className="px-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </Button>
                  </div>
                  
                  <KeywordInput
                    category="authority_department_filters"
                    placeholder="Type and hit enter..."
                    initialKeywords={[
                      "Police Chief",
                      "Detective",
                      "Police",
                      "Marshall",
                      "Sheriff",
                      "Police Services"
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthorityLevelsComponent; 