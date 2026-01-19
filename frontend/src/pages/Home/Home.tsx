import Header from "./components/Header";
import { Button, Card } from "flowbite-react";
import NoavaFooter from "../../shared/components/NoavaFooter"


function Home() {
    return(
        <>
            <header>
                <Header />
            </header>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Flashcards built for school and classrooms
            </h5>

            <p className="font-normal text-gray-700 dark:text-gray-400">
                The simple, powerful way for teachers to create study materials and for students to learn. Designed specifically for educational environments.
            </p>

            <Button>Get started</Button>

            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Everything you need
            </h5>

            <p className="font-normal text-gray-700 dark:text-gray-400">
                Simple tools that make a real difference in the classroom
            </p>
            
            {/* Everything you need */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="max-w-sm">
                    <div className="flex items-center space-x-4">
                        <div className="shrink-0 bg-black p-3 rounded-lg">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.005 11.19V12l6.998 4.042L19 12v-.81M5 16.15v.81L11.997 21l6.998-4.042v-.81M12.003 3 5.005 7.042l6.998 4.042L19 7.042 12.003 3Z"/>
                            </svg>
                        </div>
                        <div className="min-w-0 text-start">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Decks</p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">Organize flashcards into subject-specific decks. Create, share, and reuse across classes.</p>
                        </div>
                    </div>
                </Card>

                <Card className="max-w-sm">
                    <div className="flex items-center space-x-4">
                        <div className="shrink-0 bg-black p-3 rounded-lg">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>
                        </div>
                        <div className="min-w-0 text-start">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Classrooms</p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">Invite students, assign decks, and track progress. All in one collaborative space.</p>
                        </div>
                    </div>
                </Card>

                <Card className="max-w-sm">
                    <div className="flex items-center space-x-4">
                        <div className="shrink-0 bg-black p-3 rounded-lg">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"/>
                            </svg>
                        </div>
                        <div className="min-w-0 text-start">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Dashboards</p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">Teachers get a bird's-eye view of classroom activity, completion rates, and student engagement.</p>
                        </div>
                    </div>
                </Card>

                <Card className="max-w-sm">
                    <div className="flex items-center space-x-4">
                        <div className="shrink-0 bg-black p-3 rounded-lg">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v15a1 1 0 0 0 1 1h15M8 16l2.5-5.5 3 3L17.273 7 20 9.667"/>
                            </svg>
                        </div>
                        <div className="min-w-0 text-start">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Analytics</p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">Detailed insights into individual and class performance. Identify who needs extra help.</p>
                        </div>
                    </div>
                </Card>
            </div>


            {/* Available everywhere */}
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Available everywhere
            </h5>

            <p className="font-normal text-gray-700 dark:text-gray-400">
                Study at school, at home, or on the bus. Your flashcards sync across all your devices.
            </p>

            <Card className="max-w-sm bg-none">
                <div className="shrink-0 bg-black p-3 rounded-lg">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 15h12M6 6h12m-6 12h.01M7 21h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1Z"/>
                    </svg>
                </div>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Mobile
                </h5>
            </Card>

            <Card className="max-w-sm bg-none">
                <div className="shrink-0 bg-black p-3 rounded-lg">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 15h12M6 6h12m-6 12h.01M7 21h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1Z"/>
                    </svg>
                </div>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Desktop
                </h5>
            </Card>


            <NoavaFooter />
        </>
    )
}

export default Home;