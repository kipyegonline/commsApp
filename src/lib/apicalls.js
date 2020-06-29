export const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    if (res.statusText) {
      const data = await res.json();
      return data;
    } else {
      throw new Error("Couldn't get that.");
    }
  } catch {
    return [];
  }
};
