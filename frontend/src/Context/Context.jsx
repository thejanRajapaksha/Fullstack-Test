import React, { Component, createContext, useState } from "react";
//import items from "../Data/data";

// React Contexts
const RoomContext = createContext();
const UserContext = createContext();

class RoomProvider extends Component {
  state = {
    rooms: [],
    sortedRooms: [],
    featuredRooms: [],
    loading: true,
    type: "all",
    capacity: 1,
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    minSize: 0,
    maxSize: 0,
    breakfast: false,
    pets: false,
  };

  //Updated componentDidMount
  componentDidMount() {
    Promise.all([fetch("/api/roomtypes"), fetch("/api/rooms")])
      .then(([roomTypesRes, roomsRes]) => Promise.all([roomTypesRes.json(), roomsRes.json()]))
      .then(([roomTypes, rooms]) => {
        let formattedRooms = this.formatData(rooms);
        let featuredRooms = formattedRooms.filter((room) => room.featured === true);

        this.setState({
          rooms: formattedRooms,
          sortedRooms: formattedRooms,
          featuredRooms,
          loading: false,
        });
      })
      .catch((error) => console.error("Error fetching rooms:", error));
}


  formatData(items) {
    let tempItems = items.map((item) => {
      let id = item.sys.id;
      let images = item.fields.images.map((image) => image.fields.file.url);
      let room = { ...item.fields, images, id };
      return room;
    });
    return tempItems;
  }

  getRoom = (slug) => {
    let tempRooms = [...this.state.rooms];
    const room = tempRooms.find((room) => room.slug === slug);
    return room;
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = event.target.name;

    this.setState(
      {
        [name]: value,
      },
      this.filterRooms
    );
  };

  filterRooms = () => {
    let {
      rooms,
      type,
      capacity,
      price,
      minSize,
      maxSize,
      breakfast,
      pets,
    } = this.state;

    let tempRooms = [...rooms];
    capacity = parseInt(capacity);
    price = parseInt(price);

    if (type !== "all") {
      tempRooms = tempRooms.filter((room) => room.type === type);
    }
    if (capacity !== 1) {
      tempRooms = tempRooms.filter((room) => room.capacity >= capacity);
    }
    tempRooms = tempRooms.filter((room) => room.price <= price);
    tempRooms = tempRooms.filter(
      (room) => room.size >= minSize && room.size <= maxSize
    );
    if (breakfast) {
      tempRooms = tempRooms.filter((room) => room.breakfast === true);
    }
    if (pets) {
      tempRooms = tempRooms.filter((room) => room.pets === true);
    }

    this.setState({
      sortedRooms: tempRooms,
    });
  };

  render() {
    return (
      <RoomContext.Provider
        value={{
          ...this.state,
          getRoom: this.getRoom,
          handleChange: this.handleChange,
        }}
      >
        {this.props.children}
      </RoomContext.Provider>
    );
  }
}

// Adding the withRoomConsumer function
const RoomConsumer = RoomContext.Consumer;

//export function withRoomConsumer(Component) {
  const withRoomConsumer = (Component) => {
  return function ConsumerWrapper(props) {
    return (
      <RoomConsumer>
        {(value) => <Component {...props} context={value} />}
      </RoomConsumer>
    );
  };
}

// User Context Provider for managing user authentication and roles
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { RoomProvider, UserProvider, RoomContext, UserContext, withRoomConsumer };



