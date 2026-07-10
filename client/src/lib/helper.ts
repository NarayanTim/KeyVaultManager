
interface InputValidate{
    value: string;
    mainTitle?: string;
    title?: string;
    minSize?: number;
    maxSize?: number;
}

export const validate = ({value, minSize=5, maxSize=100, title="Name", mainTitle="Project"}:InputValidate): string => {
  if (!value.trim()) return `${mainTitle} ${title} is required.`;
  if (value.trim().length < minSize) return `${title} must be at least ${minSize} characters.`;
  if (value.trim().length > maxSize) return `${title} must be ${maxSize} characters or fewer.`;
  return '';
}