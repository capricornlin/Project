import React from "react";

const Search = ({ search_invoke, setInput }) => {
  const InputHandler = (e) => {
    //console.log(e.target.value);
    setInput(e.target.value); //在輸入的時候這邊就會改變input的值
  };

  return (
    <div className="search">
      <input onChange={InputHandler} type="text" />
      {/* 一點Search就會觸發search() */}
      <button onClick={search_invoke}>Search</button>
    </div>
  );
};

export default Search;
