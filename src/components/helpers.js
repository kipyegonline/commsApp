import React from "react";

export function formatNums(num) {
  if (num > 1000) {
    return num / 1e3 + "K";
  } else {
    return num;
  }
}
export function formatNumParse(num) {
  if (num > 1000) {
    return parseInt(num / 1e3) + "K";
  } else {
    return num;
  }
}

export function formatNumLocale(num) {
  return num !== undefined ? num.toLocaleString("en") : 0;
}

export function getWidth() {
  let w = document.documentElement.clientWidth;
  if (w <= 480) {
    return [300, 200];
  } else if (w <= 768) {
    return [600, 480];
  } else {
    return [800, 680];
  }
}
export function getHeight() {
  let w = document.documentElement.clientWidth;
  if (w <= 480) {
    return [300, 180];
  } else {
    return [400, 280];
  }
}

export function sumValues(arr, field) {
  const answer = arr
    .filter((ar) => !Number.isNaN(Number(ar[field])))
    .reduce((a, b) => a + b[field], 0);
  return answer > 1e3 ? answer.toLocaleString() : answer;
}

export const Suspense = ({ chart, spinner }) => (
  <div className=" mt-5 mx-auto p-5">
    {spinner ? (
      <p className=" text-center ">
        <FontAwesomeIcon icon={faSpinner} size="6x" pulse color="blue" />{" "}
      </p>
    ) : null}
    {spinner ? (
      <p className="suspense-p text-center">Loading {chart}....</p>
    ) : (
      <p className="text-danger">
        Error loading {chart}. <br /> Check internet connection and try again
      </p>
    )}
  </div>
);
export const useMobile = () =>
  document.documentElement.clientWidth <= 480 ? true : false;

//departments
const creatLocal = () => {};
export const editLocal = (data, editedData) => {
  let localdata = JSON.parse(localStorage.getItem("depts"));
  let d = localdata.findIndex((dt) => dt.altId === data.id);
  localdata[d] = editedData;
  localStorage.setItem("depts", JSON.stringify(localdata));
};
export const getLocal = () => {
  let data = JSON.parse(localStorage.getItem("depts"));
  const payload = data.map((d) => ({ ...d, id: d.altId }));
  return payload;
};
export const handleLocalStorage = (inData) => {
  let data = JSON.parse(localStorage.getItem("depts"));
  if (data) {
    data = [...data, inData];
    localStorage.setItem("depts", JSON.stringify(data));
  } else {
    localStorage.setItem("depts", JSON.stringify([]));
    let data = JSON.parse(localStorage.getItem("depts"));
    data = [...data, inData];
    localStorage.setItem("depts", JSON.stringify(data));
  }
};
