import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

export function UserTable({ users, isLoading }) {
  if (isLoading) {
    return (
      <div className="border-2 border-foreground">
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin border-4 border-foreground border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="border-2 border-foreground p-12 text-center">
        <p className="text-xl font-medium">No users found</p>
        <p className="mt-2 text-muted-foreground">Create your first user to get started.</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-foreground overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-foreground bg-muted hover:bg-muted">
            <TableHead className="font-bold uppercase tracking-wider">Name</TableHead>
            <TableHead className="font-bold uppercase tracking-wider">Email</TableHead>
            <TableHead className="font-bold uppercase tracking-wider">Gender</TableHead>
            <TableHead className="font-bold uppercase tracking-wider">Age</TableHead>
            <TableHead className="font-bold uppercase tracking-wider text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-b border-muted hover:bg-accent/50">
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="font-mono text-sm">{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="border-2 border-foreground capitalize"
                >
                  {user.gender}
                </Badge>
              </TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm" className="border-2 border-foreground">
                  <Link to={`/users/${user.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
