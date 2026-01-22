import Header from "./components/Header";
import { Button, Card } from "flowbite-react";
import NoavaFooter from "../../shared/components/NoavaFooter";
import { HiCube, HiUserGroup, HiViewGrid, HiChartBar, HiDesktopComputer, HiOutlineDeviceMobile } from "react-icons/hi";
import { useTranslation } from 'react-i18next';
import { SignUpButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function Home() {
    const { t } = useTranslation('home');
    const { isSignedIn } = useUser();
    const navigate = useNavigate();
    return (
        <>
            <Header />
            
            {/* Hero Section */}
            <section className="bg-gray-900 dark:bg-gray-900 py-16">
                <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                        {t('hero.title')}
                    </h1>

                    <p className="text-lg font-normal text-gray-300 mb-8 max-w-2xl mx-auto">
                        {t('hero.description')}
                    </p>
                </div>
                <div className="flex justify-center">
                    <SignUpButton>
                        <Button>{t('hero.cta')}</Button>
                    </SignUpButton>
                </div>
                {/* <div className="flex justify-center">
                    {isSignedIn ? (
                        <Button onClick={() => navigate('/dashboard')}>{t('hero.cta')}</Button>
                    ) : (
                        <SignUpButton>
                            <Button>{t('hero.cta')}</Button>
                        </SignUpButton>
                    )}
                </div> */}
            </section>

            {/* Everything you need Section */}
            <section className="bg-gray-900 dark:bg-gray-900 py-16">
                <div className="container mx-auto px-4 py-16 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                            {t('features.title')}
                        </h2>
                        <p className="text-lg font-normal text-gray-300 mb-4">
                            {t('features.description')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Decks Card */}
                        <Card>
                            <div className="flex items-start space-x-4">
                                <div className="shrink-0 bg-primary-700 dark:bg-primary-600 p-3 rounded-lg border border-primary-500">
                                    <HiCube className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-text-title-light dark:text-text-title-dark mb-2">
                                        {t('features.decks.title')}
                                    </h3>
                                    <p className="text-sm text-text-body-light dark:text-text-body-dark">
                                        {t('features.decks.description')}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Classrooms Card */}
                        <Card>
                            <div className="flex items-start space-x-4">
                                <div className="shrink-0 bg-primary-700 dark:bg-primary-600 p-3 rounded-lg border border-primary-500">
                                    <HiUserGroup className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-text-title-light dark:text-text-title-dark mb-2">
                                        {t('features.classrooms.title')}
                                    </h3>
                                    <p className="text-sm text-text-body-light dark:text-text-body-dark">
                                        {t('features.classrooms.description')}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Dashboards Card */}
                        <Card>
                            <div className="flex items-start space-x-4">
                                <div className="shrink-0 bg-primary-700 dark:bg-primary-600 p-3 rounded-lg border border-primary-500">
                                    <HiViewGrid className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-text-title-light dark:text-text-title-dark mb-2">
                                        {t('features.dashboards.title')}
                                    </h3>
                                    <p className="text-sm text-text-body-light dark:text-text-body-dark">
                                        {t('features.dashboards.description')}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Analytics Card */}
                        <Card>
                            <div className="flex items-start space-x-4">
                                <div className="shrink-0 bg-primary-700 dark:bg-primary-600 p-3 rounded-lg border border-primary-500">
                                    <HiChartBar className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-text-title-light dark:text-text-title-dark mb-2">
                                        {t('features.analytics.title')}
                                    </h3>
                                    <p className="text-sm text-text-body-light dark:text-text-body-dark">
                                        {t('features.analytics.description')}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Available everywhere Section - Licht in light mode, donker in dark mode */}
            <section className="bg-gray-50 dark:bg-gray-800 py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-title-light dark:text-text-title-dark mb-4">
                            {t('platforms.title')}
                        </h2>
                        <p className="text-lg font-normal text-text-body-light dark:text-text-body-dark">
                            {t('platforms.description')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* Mobile Card */}
                        <Card>
                            <div className="text-center">
                                <div className="inline-flex bg-primary-700 dark:bg-primary-600 p-4 rounded-lg mb-4 border border-primary-500">
                                    <HiOutlineDeviceMobile className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-text-title-light dark:text-text-title-dark">
                                    {t('platforms.mobile')}
                                </h3>
                            </div>
                        </Card>

                        {/* Desktop Card */}
                        <Card>
                            <div className="text-center">
                                <div className="inline-flex bg-primary-700 dark:bg-primary-600 p-4 rounded-lg mb-4 border border-primary-500">
                                    <HiDesktopComputer className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-text-title-light dark:text-text-title-dark">
                                    {t('platforms.desktop')}
                                </h3>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <NoavaFooter />
        </>
    );
}

export default Home;