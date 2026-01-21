import { useTheme } from '../../contexts/ThemeContext';
import { HiMoon, HiSun } from 'react-icons/hi';



function ThemeToggle() {
  
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}  
      className="relative w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label="Toggle theme"
    >
      
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'  
        }`}
      >
        
        {theme === 'light' ? (
          <HiSun className="h-4 w-4 text-yellow-500" />
        ) : (
          <HiMoon className="h-4 w-4 text-blue-400" />
        )}
      </div>
    </button>
  );
}

export default ThemeToggle;