import { Button } from 'flowbite-react';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

type BackButtonProps = {
  text: string;
  href: string;
};

function BackButton({ text, href }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="my-6">
        <Button
          color="alternative"
          size="sm"
          onClick={() => navigate(href)}
          className="flex bg-transparent gap-2 hover:border-border-dark hover:shadow-sm text-text-muted-light dark:text-text-muted-dark"
          outline>
          <HiArrowLeft className="w-4 h-4" />
          {text}
        </Button>
      </div>
    </>
  );
}

export default BackButton;
