import React, { useState, useEffect } from "react"; //useEffect 當頁面被開啟時馬上可以執行search
import Search from "../component/Search";
import Picture from "../component/Picture";
import { dblClick } from "@testing-library/user-event/dist/click";

const Homepage = () => {
  const [input, setInput] = useState("");
  //TODO: 這個data是要放入所有圖片的資訊
  let [data, setData] = useState(null);
  let [currentSearch, setCurrentSearch] = useState("");
  //TODO: useState(2) 這樣才不會出現重複的，因為initialURL page = 1
  //我們這時候按下more page時 newURL page = 1，還是1所以會重複，如果設定page = 2就不會重複
  //以上情況是在還沒在search裡面加上setPage(2)的情形
  let [page, setPage] = useState(1);
  const auth = "563492ad6f91700001000001714022688f6c4f42887574e0d15090ae";
  const initialURL = "https://api.pexels.com/v1/curated?page=1&per_page=15";
  const searchURL = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=1`;

  //Fetch data from pixel API
  const search = async (url) => {
    setPage(2);
    const dataFetch = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", Authorization: auth },
    });
    let parseData = await dataFetch.json();
    //TODO: parseData.photos是一個object array
    setData(parseData.photos);
    //console.log(parseData);
  };

  //load more picture
  const morepicture = async () => {
    let newURL;
    if (currentSearch === "") {
      newURL = `https://api.pexels.com/v1/curated?page=${page}&per_page=15`;
    } else {
      newURL = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`;
    }
    setPage(page + 1);
    const dataFetch = await fetch(newURL, {
      method: "GET",
      headers: { Accept: "application/json", Authorization: auth },
    });
    let parseData = await dataFetch.json();
    setData(data.concat(parseData.photos));
  };

  //Fetch data when the page load up
  //TODO: [] 代表只有首次lode進頁面時會觸發這個useEffect
  useEffect(() => {
    search(initialURL);
  }, []);

  //TODO: 因為在page剛load時就會執行一遍了，跟上面的useEffect一樣，但上面只會執行一次
  //這個useEffect則是第一次load頁面行執行一次，然後接下來currentSearch變化才會再執行一次
  useEffect(() => {
    //search(searchURL);
    if (currentSearch === "") {
      search(initialURL);
    } else {
      search(searchURL);
    }
  }, [currentSearch]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Search
        //TODO: 這個意思是當我們在Search.js上click search button 後才觸發search(searchURL)
        search_invoke={() => {
          //TODO: closure問題
          //因為編譯器會直接先抓所有的變數，如果沒有在這closure設定的話，就去global抓
          //這時searchURL裡面的currentSearch = ""，所以就算先用setCurrentSearch(input)也沒用
          //會在setCurrentSearch(input)執行前就先抓好變數值
          //所以按下search button我們就只需要改變currentSearch的值就好
          //而再使用useEffect來觸發search() function
          setCurrentSearch(input);
          //search(searchURL);
        }}
        setInput={setInput}
      />
      <div className="pictures">
        {data &&
          data.map((d) => {
            return <Picture data={d} />;
          })}
      </div>
      <div className="morePicture">
        <button onClick={morepicture}>Load More</button>
      </div>
    </div>
  );
};

export default Homepage;
