import { Button } from 'flowbite-react';
import { LuPlus } from 'react-icons/lu';
import PageHeader from '../../../shared/components/PageHeader';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <>
      <header>
        <PageHeader>
          <div className="flex flex-col gap-2 p-3 text-center">
            <h1 className="text-4xl font-bold text-text-title-light dark:text-text-title-dark">
              Admin Dashboard
            </h1>
            <p className="text-text-body-light dark:text-text-body-dark">
              Welcome to the Noava Admin Dashboard
            </p>
          </div>

          <div className="flex justify-end">
            <Button as={Link} to="/schools">
              <LuPlus className="w-5 h-5 mr-2" />
              Create School
            </Button>
          </div>
        </PageHeader>
      </header>
    </>
  );
}

export default AdminDashboard;
