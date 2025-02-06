import styles from "../styles/History.module.css";
import Card from "./Card";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducers/user";
import { removeAllHistory } from "../reducers/history";
import { removeHistory } from "../reducers/history";

export default function History() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const bookmark = useSelector((state) => state.bookmarks.value);
  const history = useSelector((state) => state.history.value);
  const histories = history.flat();


  const handleOpen = (newOpen) => {
    setOpen(newOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeAllHistory());
    router.push("/");
  };

  const handleRemove = (cityName) => {
    fetch(`http://localhost:3000/cities/${cityName}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(removeHistory({ name: cityName }));
        } else {
          console.error("Error:", data.error);
        }
      });
  };



  const drawerList = (
    <Box
      sx={{ width: 250, height: "100vh", fontSize: 34, background: "#225A86" }}
      role="presentation"
      onClick={() => handleOpen(false)}
    >
      <List>
        <ListItem className={styles.list} disablePadding>
          <span
            className={styles.lien}
            onClick={() => router.push("/bookmarks")}
          >
            Bookmarks
          </span>
          <span className={styles.lien} onClick={() => router.push("/history")}>
            History
          </span>
          <span
            className={styles.lien}
            onClick={() => router.push("/settings")}
          >
            Settings
          </span>
          <span className={styles.lien} onClick={handleLogout}>
            Logout
          </span>
        </ListItem>
      </List>
    </Box>
  );

  const cities = histories
    .filter(
      (data, i, self) =>
        //verifie si l'index de la premiere occurence de cette ville est le même que l'index actuel du tableau.
        //Si c'est le cas, c'est la première fois qu'on rencontre cette ville et on la garde, sinon on la supprime
        self.findIndex((city) => city.name === data.name) === i
    )
    .map((data, e) => {
      const isLiked = bookmark.some((city) => city.name === data.name);
      return (
        <div className={styles.card}>
          <Card key={e} {...data} isLiked={isLiked} handleRemove={handleRemove}/>{" "}
        </div>
      );
    });

  return (
    <div>
      <div className={styles.header}>
        <img
          src="/logo.svg"
          alt="logo"
          className={styles.logo}
          onClick={() => router.push("/home")}
        />
        <h1>History</h1>
        <img
          className={styles.search}
          src="/user.png"
          alt="logo user"
          onClick={() => handleOpen(true)}
        />
        <Drawer
          open={open}
          onClose={() => handleOpen(false)}
          sx={{ backgroundColor: "transparent" }}
        >
          {drawerList}
        </Drawer>
      </div>
      <div>
        <div className={styles.cityContainer}>{cities}</div>
      </div>
    </div>
  );
}
