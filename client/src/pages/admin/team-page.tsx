import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/admin-layout';
import { TeamMember } from '@shared/schema';
import { Loader2, Plus, Edit, Eye, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import TeamForm from '@/components/forms/team-form';

const TeamPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch team members
  const { 
    data: teamMembers, 
    isLoading 
  } = useQuery<TeamMember[]>({ 
    queryKey: ['/api/team'] 
  });
  
  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: number; visible: boolean }) => {
      await apiRequest('PATCH', `/api/team/${id}`, { visible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      toast({
        title: "Team member updated",
        description: "The visibility has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update the team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  const handleToggleVisibility = (member: TeamMember) => {
    toggleVisibilityMutation.mutate({ id: member.id, visible: !member.visible });
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['/api/team'] });
    toast({
      title: "Team member added",
      description: "The new team member has been added successfully.",
    });
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedMember(null);
    queryClient.invalidateQueries({ queryKey: ['/api/team'] });
    toast({
      title: "Team member updated",
      description: "The team member has been updated successfully.",
    });
  };

  return (
    <AdminLayout 
      title="Team Management" 
      description="Add, edit, and manage team members."
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Team Members</h2>
          <p className="text-gray-500">
            {teamMembers?.length || 0} team members in total
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Add Team Member
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex-shrink-0 overflow-hidden">
                            {member.imageUrl ? (
                              <img 
                                src={member.imageUrl} 
                                alt={member.name} 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full">
                                <span className="material-icons text-gray-400">person</span>
                              </div>
                            )}
                          </div>
                          <span>{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleVisibility(member)}
                          disabled={toggleVisibilityMutation.isPending}
                        >
                          {member.visible ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleVisibility(member)}
                            disabled={toggleVisibilityMutation.isPending}
                          >
                            {member.visible ? "Hide" : "Show"}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No team members found. Add your first team member by clicking the "Add Team Member" button.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Team Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <TeamForm onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <TeamForm 
              member={selectedMember} 
              onSuccess={handleEditSuccess} 
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TeamPage;
