import { useState } from "react";
import "./AddList.css";

export function AddList(props) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    props.add({ id: "c" + (props.list.length + 1), text: inputValue }); // Creating a new course object
    setInputValue(""); // Clearing input field after submission
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input type="text" value={inputValue} onChange={handleChange} />
      <button type="submit">Add</button>
    </form>
  );
}
