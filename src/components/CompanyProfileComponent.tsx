import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KeywordInput from "@/components/ui/KeywordInput";

interface CompanyProfileData {
  companyName: string;
  website: string;
  industry: string;
  prompt: string;
  keywords: string[];
}

interface CompanyProfileProps {
  data: CompanyProfileData;
  updateData: (data: Partial<CompanyProfileData>) => void;
}

const CompanyProfileComponent = ({ data, updateData }: CompanyProfileProps) => {
  // Initialize local state with the data from props
  const [formValues, setFormValues] = useState({
    companyName: data.companyName || "",
    website: data.website || "",
    industry: data.industry || "",
    prompt: data.prompt || ""
  });

  // Update parent component when form values change
  useEffect(() => {
    // Using a local function to prevent dependency on updateData
    const updateParentData = () => {
      updateData(formValues);
    };
    
    updateParentData();
  }, [formValues]); // Removed updateData from dependencies

  // Handle input changes
  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle keywords update
  const handleKeywordsChange = (keywords: string[]) => {
    updateData({ keywords });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Company profile</h1>
      <p className="text-gray-500 mt-2">Pursuit surfaces opportunities that are relevant to you, based on your Company Profile</p>

      <div className="mt-8">
        <h2 className="text-lg font-medium">General</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Company name <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="Pursuit" 
              value={formValues.companyName} 
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="w-full" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Website <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="https://pursuit.com" 
              value={formValues.website} 
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="w-full" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Industry <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="Construction" 
              value={formValues.industry} 
              onChange={(e) => handleInputChange("industry", e.target.value)}
              className="w-full" 
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium">Data profile</h2>
        <p className="text-sm text-gray-500">This information will be used to extract relevant data for your Radar feed</p>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Prompt <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">Tell us what you're looking for specifically, and the types of opportunities you'd like to find.</p>
          <textarea 
            className="w-full rounded-md border border-gray-300 p-3 min-h-[120px]"
            value={formValues.prompt} 
            onChange={(e) => handleInputChange("prompt", e.target.value)}
            placeholder="Identify higher education institutions struggling with degree completion..."
          />
        </div>

        <div className="mt-6">
          <KeywordInput 
            category="opportunity_keywords"
            label="Keywords *"
            helpText="Enter comma-separated keywords to help us identify the types of opportunities you'd like to see"
            initialKeywords={data.keywords.length > 0 ? data.keywords : [
              "Higher education",
              "Student success",
              "Degree completion",
              "Student retention",
              "Academic pathways"
            ]}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">
            Target Personas
          </label>
          <p className="text-xs text-gray-500 mb-2">Select the personas you want to target. We'll find opportunities tailored to your selections</p>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="it">IT</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-3">
            <KeywordInput 
              category="target_personas"
              placeholder="Type persona and press enter"
              initialKeywords={[
                "Education",
                "HR",
                "IT"
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileComponent; 