import randomNameGenerator from "@atomiclotus/random-name-generator";

export const getRelativeDateWithTime = (date: Date) => {
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compareDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffTime = today.getTime() - compareDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "today";
  } else if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays > 1 && diffDays <= 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const generateRandomUsername = () => {
  const randomName = randomNameGenerator.get();
  return randomName;
};

export const isValidUsername = (username: string) => {
  return 5 <= username.length && username.length <= 20;
};

export const cleanBusinessType = (type: string) => {
  return type.split("_").join(" ");
};
