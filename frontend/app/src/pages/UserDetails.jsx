import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser, useUpdateUser, useDeleteUser } from '@/hooks/useUsers';
import { UserFormDialog } from '@/components/UserFormDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Mail, Calendar, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: user, isLoading, isError } = useUser(id || '');
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleUpdateUser = (data) => {
    if (!id) return;
    updateUser.mutate(
      {
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        gender: data.gender,
        age: data.age,
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
        },
      }
    );
  };

  const handleDeleteUser = () => {
    if (!id) return;
    deleteUser.mutate(id, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin border-4 border-foreground border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Button asChild variant="outline" className="mb-6 border-2 border-foreground">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
          <div className="border-2 border-destructive bg-destructive/10 p-8 text-center">
            <p className="text-xl font-medium text-destructive">User not found</p>
            <p className="mt-2 text-muted-foreground">
              The user you're looking for doesn't exist or has been deleted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Button asChild variant="outline" className="mb-8 border-2 border-foreground">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>

        <Card className="border-2 border-foreground shadow-md">
          <CardHeader className="border-b-2 border-foreground bg-muted/50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center border-2 border-foreground bg-primary shadow-xs">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="mt-2 border-2 border-foreground capitalize"
                  >
                    {user.gender}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="border-2 border-foreground"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-3 border-2 border-foreground p-4">
                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 font-mono">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-2 border-foreground p-4">
                <UserIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Age
                  </p>
                  <p className="mt-1 text-2xl font-bold">{user.age}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-2 border-foreground p-4">
                <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Created
                  </p>
                  <p className="mt-1">{format(new Date(user.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <UserFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={user}
          onSubmit={handleUpdateUser}
          isLoading={updateUser.isPending}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteUser}
          userName={`${user.firstName} ${user.lastName}`}
          isLoading={deleteUser.isPending}
        />
      </div>
    </div>
  );
};

export default UserDetails;
