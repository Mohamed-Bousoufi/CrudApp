import { useState } from 'react';
import { useUsers, useCreateUser } from '@/hooks/useUsers';
import { UserTable } from '@/components/UserTable';
import { UserFormDialog } from '@/components/UserFormDialog';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

const UserList = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: users = [], isLoading, isError } = useUsers();
  const createUser = useCreateUser();

  const handleCreateUser = async (data) => {
    setFormError('');
    setIsSubmitting(true);
    try {
      await createUser.mutate({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        gender: data.gender,
        age: data.age,
      });
      setIsCreateDialogOpen(false); // Only close on success
    } catch (err) {
      // Set error, do not close modal, do not reset form
      let message = 'Failed to create user';
      if (err && err.message) {
        message = err.message;
      }
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open) => {
    setIsCreateDialogOpen(open);
    if (open) setFormError(''); // Clear error when opening
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 m-10">
        <header className="mb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center border-2 border-foreground bg-primary shadow-sm">
                <Users className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">
                  Manage your team members and their information
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="shadow-sm"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add User
            </Button>
          </div>
        </header>

        {isError ? (
          <div className="border-2 border-destructive bg-destructive/10 p-6 text-center">
            <p className="text-lg font-medium text-destructive">Failed to load users</p>
            <p className="mt-1 text-muted-foreground">
              Please try refreshing the page.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {users.length} {users.length === 1 ? 'user' : 'users'} total
              </p>
            </div>
            <UserTable users={users} isLoading={isLoading} />
          </div>
        )}

        <UserFormDialog
          open={isCreateDialogOpen}
          onOpenChange={handleOpenChange}
          onSubmit={handleCreateUser}
          isLoading={isSubmitting}
          error={formError}
        />
      </div>
    </div>
  );
};

export default UserList;
