import { useState } from "react";
import "./Course.css";
import { AddList } from "../components/AddList";

export const Course = () => {
  const [listCourse, setListCourse] = useState([{ id: "c1", text: "test1" }]);

  function addList(item) {
    setListCourse([...listCourse, item]);
  }

  return (
    <div>
      <h1> Course </h1>
      <AddList list={listCourse} add={addList}></AddList>
      <ul className="list-course">
        {listCourse.map((item) => {
          return <li key={item.id}> {item.text}</li>;
        })}
      </ul>
    </div>
  );
};
