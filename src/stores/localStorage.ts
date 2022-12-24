export const saveState = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  }
  catch (err) {
    console.error(err);
  }
};

export const getState = (key: string) => {
  try {
    return localStorage.getItem(key);
  }
  catch (err) {
    console.error(err);
  }
};
