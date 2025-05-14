import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContactMessage } from '@shared/schema';
import { Eye } from 'lucide-react';

interface MessageListProps {
  messages: ContactMessage[];
  onViewMessage: (message: ContactMessage) => void;
}

const MessageList = ({ messages, onViewMessage }: MessageListProps) => {
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

  if (messages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No messages found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sender</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id} className={message.isRead ? '' : 'bg-blue-50'}>
              <TableCell className="font-medium">
                <div>
                  <div>{message.name}</div>
                  <div className="text-sm text-gray-500">{message.email}</div>
                </div>
              </TableCell>
              <TableCell>{message.subject || "No Subject"}</TableCell>
              <TableCell>
                <div className="max-w-xs truncate">
                  {message.message}
                </div>
              </TableCell>
              <TableCell>{formatDate(message.createdAt)}</TableCell>
              <TableCell>
                <Badge variant={message.isRead ? "outline" : "default"} className={!message.isRead ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}>
                  {message.isRead ? "Read" : "Unread"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewMessage(message)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MessageList;
