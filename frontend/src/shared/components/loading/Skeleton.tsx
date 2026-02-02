import NoavaFooter from '../navigation/NoavaFooter';
import PageHeader from '../PageHeader';

function Skeleton() {
  return (
    <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <div className="flex-1 w-full ml-0">
        <PageHeader>
          <div className="pt-4 md:pt-8">
            <div className="animate-pulse">
              <div className="w-32 h-8 mb-4 rounded bg-background-surface-light md:h-12 dark:bg-background-surface-dark md:w-48"></div>
              <div className="w-48 h-4 rounded bg-background-surface-light md:h-6 dark:bg-background-surface-dark md:w-96"></div>
            </div>
          </div>
        </PageHeader>
        <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
          <div className="container px-4 py-8 mx-auto md:py-20 max-w-7xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 rounded-lg bg-background-surface-light dark:bg-background-surface-dark"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <NoavaFooter />
      </div>
    </div>
  );
}

export default Skeleton;
