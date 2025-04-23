import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InviteUsersData {
  invitedUsers: string[];
}

interface InviteUsersProps {
  data: InviteUsersData;
  updateData: (data: Partial<InviteUsersData>) => void;
}

const InviteUsersComponent = ({ data, updateData }: InviteUsersProps) => {
  const [email, setEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>(data.invitedUsers || []);

  // Update parent when invited users change
  useEffect(() => {
    updateData({ invitedUsers: invitedEmails });
  }, [invitedEmails]); // Removed updateData from dependencies to prevent infinite loops
  
  const handleInvite = () => {
    if (email && isValidEmail(email) && !invitedEmails.includes(email)) {
      setInvitedEmails([...invitedEmails, email]);
      setEmail("");
    }
  };

  const handleRemoveInvite = (emailToRemove: string) => {
    setInvitedEmails(invitedEmails.filter(e => e !== emailToRemove));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Invite users</h1>
      <p className="text-gray-500 mt-2">Invite your team members to collaborate with you on Pursuit</p>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Team members</h2>
        
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleInvite();
              }
            }}
          />
          <Button 
            onClick={handleInvite}
            disabled={!email || !isValidEmail(email) || invitedEmails.includes(email)}
          >
            Invite
          </Button>
        </div>

        {invitedEmails.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Invited users</h3>
            <div className="flex flex-wrap gap-2">
              {invitedEmails.map((invitedEmail) => (
                <Badge 
                  key={invitedEmail}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md flex items-center gap-1"
                >
                  {invitedEmail}
                  <span 
                    className="cursor-pointer ml-1" 
                    onClick={() => handleRemoveInvite(invitedEmail)}
                  >
                    ×
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No users invited yet</p>
        )}

        <div className="mt-8 bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Roles and permissions</h3>
          <p className="text-sm text-gray-500">
            All invited users will be added as collaborators with full access to your Pursuit account.
            You can manage roles and permissions from your account settings after completing onboarding.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteUsersComponent; 