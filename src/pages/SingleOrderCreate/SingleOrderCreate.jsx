import React, { useEffect, useState } from "react";
import {
  createOrder,
  getCheckData,
  getOneRestaurant,
  getProfile,
  getAllRestaurants,
 
} from "../../services/services";
import { paginate } from "../../utilities/utilities";
import { useHistory } from "react-router-dom";
import "./singleOrderCreate.css"

export const SingleOrderCreate = () => {
  const history = useHistory();
  const [restaurantInfo, setRestaurantInfo] = useState("");
  const [orderInput, setOrderInput] = useState("");
  const [profile, setProfile] = useState("");
  const [pollCreator, setPollCreator] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(undefined);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState("");
  const [page, setPage] = useState(0);
  const [filterInput, setFilterInput] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [pollId,setPollId] = useState(localStorage.getItem("orderPollId") ? localStorage.getItem("orderPollId") : '')
  const [restaurantId,setRestaurantId] = useState(localStorage.getItem("orderRestaurantId") ? localStorage.getItem("orderRestaurantId") : undefined)
  useEffect(() => {
   restaurantId && getOneRestaurant(restaurantId).then((res) => {
      console.log(res);
      setRestaurantInfo(res.data);
    });
    selectedRestaurantId && getOneRestaurant(selectedRestaurantId).then((res) => {
      console.log(res);
      setRestaurantInfo(res.data);
    });
    getProfile().then((res) => {
      console.log(res.data);
      setProfile(res.data);
    });
    getAllRestaurants().then((res) => {
      console.log(res);
      setRestaurants(res.data);
    });

  }, [restaurantId,selectedRestaurantId]);

  useEffect(() => {
    if (profile !== "")
      getCheckData().then((res) => {
        console.log(res.data);
        console.log(pollId)
        let handleCheckData = (el) =>
          el.email === profile.email && el.poll === pollId;
        console.log(res.data.some(handleCheckData) + " done");

        res.data.some(handleCheckData)
          ? setPollCreator(true)
          : setPollCreator(false);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);

        setPollCreator(false)
      });;
  }, [profile]);

  useEffect(() => {
    setFilteredRestaurants(
      restaurants.filter((el) =>
        el.name.toLowerCase().includes(filterInput.toLowerCase())
      )
    );
  }, [filterInput, restaurants]);

  const handleFilter = (e) => {
    setFilterInput(e.target.value);
  };

  const handleOrderInput = (e) => {
    setOrderInput(e.target.value);
  };

  const changePage = (index) => {
    setPage(index);
  };
  const handleRestaurantId = (restaurant) => {
    setSelectedRestaurantId(restaurant.id);
    setSelectedRestaurantName(restaurant.name);
  };
  const submitOrderCreateHome = (e) => {
    e.preventDefault();
    const data = { restaurantId: selectedRestaurantId, label: orderInput };
    createOrder(data).then((res) => {
      console.log(res.data.id);
      localStorage.setItem("orderId", res.data.id);
      // setTimeout(function(){ history.push(`/single-order-create/${res.data.id}`); }, 2000);
      history.push(`/single-order-add/${res.data.id}`);
    });
  };

  const submitOrderCreate = (e) => {
    e.preventDefault();
    const data = { restaurantId: restaurantId, label: orderInput };
    createOrder(data).then((res) => {
      console.log(res);
      localStorage.setItem("orderId", res.data.id);
      history.push(`/single-order-add/${res.data.id}`);
    });
  };

  return (
    <div className="div-order">
      {pollCreator ? (
        <div>
          <div className ="rest-info">{restaurantInfo.name}</div>
          <form onSubmit={submitOrderCreate}>
            <input
              type="text"
              onChange={handleOrderInput}
              value={orderInput.label}
              autoComplete="on"
            /><br></br>

            <input class="rest-info-submit" type="submit" />
          </form>
        </div>
      ) : (
        <div>
          <div>
            <form>
              <input
                type="text"
                placeholder="Search Restaurant by Name"
                name="name"
                value={filterInput.name}
                onChange={handleFilter}
                className="restaurantInput"
              />
            </form>
            {filterInput.length === 0 &&
            paginate(restaurants)[page] !== undefined ? (
              paginate(restaurants)[page].map((el) => (
                <div
                  key={el.id}
                  className="single-restaurant"
                  onClick={() => handleRestaurantId(el)}
                >
                  <p>{el.name}</p>
                  <p>{el.address}</p>

                  <hr />
                </div>
              ))
            ) : (
              <div className="restaurants-wrapper">
                {filteredRestaurants.slice(0, 4).map((el) => (
                  <div
                    key={el.id}
                    className="single-restaurant"
                    onClick={() => handleRestaurantId(el)}
                  >
                    <p>{el.name}</p>
                    <p>{el.address}</p>

                    <hr />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {filterInput.length === 0 &&
              paginate(restaurants)[page] !== undefined &&
              paginate(restaurants).length > 1 && (
                <div className="pagination-buttons">
                  {/* prev */}
                  {paginate(restaurants).map((_, idx) => {
                    return (
                      <button
                        onClick={() => changePage(idx)}
                        key={idx}
                        className={`page-btn ${
                          page === idx && `page-btn-selected`
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              )}
          </div>

          <div>
            <div>{selectedRestaurantName}</div>
            <form onSubmit={submitOrderCreateHome}>
              <input
                type="text"
                onChange={handleOrderInput}
                value={orderInput.label}
                autoComplete="on"
              /><br></br>
              <input type="submit" />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
