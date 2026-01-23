import { Button, Card } from "flowbite-react";
import { HiHome, HiQuestionMarkCircle } from "react-icons/hi";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import NoavaFooter from "../../shared/components/NoavaFooter";

function NotFound() {
    const { t } = useTranslation('common');
    const navigate = useNavigate();

    return (
        <>
            <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark flex items-center justify-center px-4">
                <div className="max-w-2xl w-full text-center">
                    <h1 className="text-9xl font-extrabold text-primary-500 dark:text-primary-400 mb-4">
                        {t('notFound.title')}
                    </h1>

                    <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-title-light dark:text-text-title-dark mb-4">
                            {t('notFound.heading')}
                        </h2>
                        <p className="text-lg text-text-body-light dark:text-text-body-dark mb-8">
                            {t('notFound.description')}
                        </p>
                    </div>

                    <div className="mb-12">
                        <Button 
                            size="lg" 
                            onClick={() => navigate('/')}
                            className="inline-flex items-center"
                        >
                            <HiHome className="mr-2 h-5 w-5" />
                            {t('notFound.backHome')}
                        </Button>
                    </div>

                    <div className="mt-8">
                        <p className="text-text-body-light dark:text-text-body-dark mb-6 font-medium">
                            {t('notFound.suggestion')}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow bg-background-surface-light dark:bg-background-surface-dark"
                                onClick={() => navigate('/')}
                            >
                                <div className="flex flex-col items-center">
                                    <HiHome className="h-10 w-10 text-primary-500 dark:text-primary-400 mb-2" />
                                    <h3 className="text-lg font-semibold text-text-title-light dark:text-text-title-dark">
                                        {t('navigation.home')}
                                    </h3>
                                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center">
                                        {t('app.welcome')}
                                    </p>
                                </div>
                            </Card>

                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow bg-background-surface-light dark:bg-background-surface-dark"
                                onClick={() => navigate('/faq')}
                            >
                                <div className="flex flex-col items-center">
                                    <HiQuestionMarkCircle className="h-10 w-10 text-primary-500 dark:text-primary-400 mb-2" />
                                    <h3 className="text-lg font-semibold text-text-title-light dark:text-text-title-dark">
                                        {t('navigation.faq')}
                                    </h3>
                                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center">
                                        {t('app.welcome')}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="mt-12 text-text-muted-light dark:text-text-muted-dark">
                        <svg 
                            className="w-64 h-64 mx-auto opacity-20" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={0.5} 
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <NoavaFooter />
        </>
    );
}

export default NotFound;
