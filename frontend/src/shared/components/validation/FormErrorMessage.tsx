import { HelperText } from 'flowbite-react';

type FormErrorMessageProps = {
  text: string;
};

function FormErrorMessage({ text }: FormErrorMessageProps) {
  return (
    <HelperText className="p-2 mt-2 mb-4 border border-red-600 rounded bg-red-900/30">
      <p className="font-medium text-red-600 dark:text-red-500">{text}</p>
    </HelperText>
  );
}

export default FormErrorMessage;
