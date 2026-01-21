import Header from "./components/Header";
import { Button, Card } from "flowbite-react";
import NoavaFooter from "../../shared/components/NoavaFooter";
import { HiCube, HiUserGroup, HiViewGrid, HiChartBar,HiDesktopComputer,  HiOutlineDeviceMobile } from "react-icons/hi";

function Home() {
    return (
        <>
            <Header />
            
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 max-w-4xl text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                    Flashcards built for school and classrooms
                </h1>

                <p className="text-lg font-normal text-gray-700 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    The simple, powerful way for teachers to create study materials and for students to learn. Designed specifically for educational environments.
                </p>

                <div className="flex justify-center">
                     <Button size="lg">Get started</Button>
                 </div>
            </section>

            {/* Everything you need Section */}
            <section className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                        Everything you need
                    </h2>
                    <p className="text-lg font-normal text-gray-700 dark:text-gray-400">
                        Simple tools that make a real difference in the classroom
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Decks Card */}
                    <Card>
                        <div className="flex items-start space-x-4">
                            <div className="shrink-0 bg-[#1E3A5F] p-3 rounded-lg border border-primary-500" >
                                <HiCube className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Decks
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Organize flashcards into subject-specific decks. Create, share, and reuse across classes.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Classrooms Card */}
                    <Card>
                        <div className="flex items-start space-x-4">
                            <div className="shrink-0 bg-[#1E3A5F] p-3 rounded-lg border border-primary-500">
                                <HiUserGroup className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Classrooms
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Invite students, assign decks, and track progress. All in one collaborative space.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Dashboards Card */}
                    <Card>
                        <div className="flex items-start space-x-4">
                            <div className="shrink-0 bg-[#1E3A5F] p-3 rounded-lg border border-primary-500">
                                <HiViewGrid className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Dashboards
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Teachers get a bird's-eye view of classroom activity, completion rates, and student engagement.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Analytics Card */}
                    <Card>
                        <div className="flex items-start space-x-4">
                            <div className="shrink-0 bg-[#1E3A5F] p-3 rounded-lg border border-primary-500">
                                <HiChartBar className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Analytics
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Detailed insights into individual and class performance. Identify who needs extra help.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Available everywhere Section */}
            <section className="bg-gray-50 dark:bg-gray-900 py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                            Available everywhere
                        </h2>
                        <p className="text-lg font-normal text-gray-700 dark:text-gray-400">
                            Study at school, at home, or on the bus. Your flashcards sync across all your devices.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* Mobile Card */}
                        <Card>
                            <div className="text-center">
                                <div className="inline-flex bg-[#1E3A5F] p-4 rounded-lg mb-4 border border-primary-500">
                                    <HiOutlineDeviceMobile className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Mobile
                                </h3>
                            </div>
                        </Card>

                        {/* Desktop Card */}
                        <Card>
                            <div className="text-center">
                                <div className="inline-flex bg-[#1E3A5F] p-4 rounded-lg mb-4 border border-primary-500">
                                    <HiDesktopComputer className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Desktop
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