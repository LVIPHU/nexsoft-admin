const URL_REGEX = /https?:\/\/[^\s]+/i;

export const getInitials = (name: string) => {
  const regex = /(\p{L})\p{L}*/gu;
  const matches = [...name.matchAll(regex)];

  if (matches.length === 0) return "";

  const first = matches[0]?.[1] ?? "";
  const last = matches[matches.length - 1]?.[1] ?? first;

  return (first + last).toUpperCase();
};

export const isUrl = (value: string | null | undefined) => {
  if (!value) return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isEmptyString = (value: string) => {
  return value === "<p></p>" || value.trim().length === 0;
};

export const extractUrl = (value: string) => {
  const match = URL_REGEX.exec(value);
  return match ? match[0] : null;
};
