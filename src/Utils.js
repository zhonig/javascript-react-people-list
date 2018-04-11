import React from "react";
import random_name from "node-random-name";
import "./index.css";

const tableSize = 5553;

const range = tableSize => {
  const arr = [];
  for (let i = 0; i < tableSize; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  
  return {
    firstName: random_name({first: true}),
	lastName: random_name({last: true}),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? "Relationship"
        : statusChance > 0.33 ? "Complicated" : "Single"
  };
};

export function makeData() {
  return range(tableSize).map(d => {
    return {
      ...newPerson(),
      children: range(pageLimit).map(newPerson)
    };
  });
}

export const Tips = () =>
  <div style={{ textAlign: "center" }}>
    <em>Tip: Hold shift when sorting to multi-sort!</em>
  </div>;
  
export const pageLimit = 10;