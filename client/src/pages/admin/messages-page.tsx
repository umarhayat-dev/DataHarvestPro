import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/admin-layout';
import MessageList from '@/components/admin/message-list';
import { ContactMessage } from '@shared/schema';
import { Loader2, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const MessagesPage = () => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch contact messages
  const { 
    data: messages, 
    isLoading 
  } = useQuery<ContactMessage[]>({ 
    queryKey: ['/api/admin/messages'] 
  });
  
  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('PATCH', `/api/admin/messages/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      toast({
        title: "Message updated",
        description: "The message has been marked as read.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to mark the message as read. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter messages to show only unread if the filter is active
  const filteredMessages = showUnreadOnly 
    ? messages?.filter(message => !message.isRead) 
    : messages;

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    // If message is unread, mark it as read
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  };

  // Format date
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout 
      title="Contact Messages" 
      description="View and manage messages from the contact form."
    >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-gray-700 mr-3">Filter:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="unread-only" 
              checked={showUnreadOnly} 
              onCheckedChange={setShowUnreadOnly}
            />
            <Label htmlFor="unread-only">Show unread messages only</Label>
          </div>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <MessageList 
            messages={filteredMessages || []} 
            onViewMessage={handleViewMessage} 
          />
        )}
      </Card>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && formatDate(selectedMessage.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">From</h3>
                <p className="mt-1">{selectedMessage.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </p>
              </div>
              
              {selectedMessage.subject && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subject</h3>
                  <p className="mt-1">{selectedMessage.subject}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Message</h3>
                <div className="mt-1 bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message to Alyusr Quran Institute'}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button>Reply via Email</Button>
                </a>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MessagesPage;
