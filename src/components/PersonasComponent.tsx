import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KeywordInput from "@/components/ui/KeywordInput";

interface PersonasData {
  selectedPersona: string | null;
  hasPersonas: boolean;
}

interface PersonasProps {
  data: PersonasData;
  updateData: (data: Partial<PersonasData>) => void;
}

const PersonasComponent = ({ data, updateData }: PersonasProps) => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(data.selectedPersona);
  
  // Update parent component when selection changes
  useEffect(() => {
    // Using a local function to prevent dependency on updateData
    const updateParentData = () => {
      // If a persona is selected, mark this step as having personas
      updateData({
        selectedPersona,
        hasPersonas: selectedPersona !== null
      });
    };
    
    updateParentData();
  }, [selectedPersona]); // Removed updateData from dependencies
  
  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Personas</h1>
          <p className="text-gray-500 mt-2">You will be able to filter Pursuit data by Personas</p>
        </div>
        {selectedPersona && (
          <div>
            <Button 
              variant="destructive" 
              className="rounded-md"
              onClick={() => setSelectedPersona(null)}
            >
              Delete persona
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column - Persona setup */}
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input placeholder="Persona" className="w-full" />
            <p className="text-xs text-gray-500 mt-1">Assign a title to this custom filter</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Key
            </label>
            <Input placeholder="persona" className="w-full" />
            <p className="text-xs text-gray-500 mt-1">Key field that will appear in your connected CRM</p>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Personas (11)</h3>
              <Button variant="ghost" className="text-blue-500 text-sm p-0 h-auto hover:bg-transparent hover:text-blue-600">+ Create new persona</Button>
            </div>
            
            {/* List of personas */}
            <div className="space-y-2">
              <div 
                className={`border ${selectedPersona === "Law Enforcement" ? 'border-blue-100 bg-blue-50' : 'border-gray-200'} rounded-md p-3 flex justify-between items-center cursor-pointer`}
                onClick={() => setSelectedPersona("Law Enforcement")}
              >
                <span className="font-medium">Law Enforcement</span>
                <span className="text-sm text-gray-500">140,216 Contacts found →</span>
              </div>
              
              {["Fire and Rescue Services", "Finance", "Human Resources", "Economic Development", 
                "Communications", "Utilities", "Administration", "Planning / Building", 
                "Elected Officials", "Procurement"].map((item, index) => (
                <div 
                  key={index} 
                  className={`border ${selectedPersona === item ? 'border-blue-100 bg-blue-50' : 'border-gray-200'} rounded-md p-3 flex justify-between items-center cursor-pointer`}
                  onClick={() => setSelectedPersona(item)}
                >
                  <span>{item}</span>
                  <span className="text-sm text-gray-500">{Math.floor(Math.random() * 600000)},000 Contacts found →</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
              onClick={() => setSelectedPersona(null)}
            >
              Create new persona
            </Button>
          </div>
        </div>
        
        {/* Right column - Item settings */}
        {selectedPersona && (
          <div>
            <h2 className="text-lg font-medium mb-4">Item settings</h2>
            <div className="text-sm text-gray-500 mb-6">
              <span className="bg-gray-100 px-2 py-1 rounded">
                <span className="text-gray-500">140,216 Contacts meet criteria</span>
              </span>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Value
              </label>
              <Input defaultValue={selectedPersona} className="w-full" />
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
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Title" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select>
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
                    category={`persona_title_filters_${selectedPersona?.replace(/\s+/g, '_').toLowerCase()}`}
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
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">AND</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 rounded">OR</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="department">Department</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select>
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
                    category={`persona_department_filters_${selectedPersona?.replace(/\s+/g, '_').toLowerCase()}`}
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

export default PersonasComponent; 