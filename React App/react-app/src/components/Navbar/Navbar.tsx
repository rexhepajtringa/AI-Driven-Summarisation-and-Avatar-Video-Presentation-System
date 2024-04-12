import { FunctionComponent, useCallback } from "react";
import { Button } from "@mui/material";
import styles from "./Navbar.module.css";

const Navbar: FunctionComponent = () => {
  const onButtonClick = useCallback(() => {
    //TODO: LOGIN ACTION
  }, []);

  const onButton1Click = useCallback(() => {
    //TODO: SIGN UP ACTION
  }, []);

  return (
    <header className={styles.paperParent}>
      <div className={styles.paper}>
        <div className={styles.toolbar}>
          <div className={styles.leftSide}>
            <div className={styles.iconbutton}>
              <div className={styles.icon}>
                <img className={styles.menufilledIcon} loading="lazy" alt="" />
              </div>
            </div>
            <div className={styles.typography}>
              <h2 className={styles.title}>{`Avatar Presenter `}</h2>
            </div>
          </div>
          <div className={styles.minHeight} />
          <div className={styles.stack}>
            <div className={styles.iconbutton1}>
              <div className={styles.icon1}>
                <img className={styles.starsharpIcon} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.frameWrapper}>
        <div className={styles.titleParent}>
          <h2 className={styles.title1}>Home</h2>
          <h2 className={styles.title2}>About</h2>
        </div>
      </div>
      <div className={styles.paperInstance}>
        <div className={styles.buttonInstance}>
          <Button
            className={styles.button}
            variant="contained"
            sx={{
              color: "#fff",
              fontSize: "15",
              background: "#2196f3",
              borderRadius: "4px",
              "&:hover": { background: "#2196f3" },
              height: 49,
            }}
            onClick={onButtonClick}>
            Log IN
          </Button>
        </div>
        <Button
          className={styles.button1}
          disableElevation={true}
          variant="outlined"
          sx={{
            color: "#2196f3",
            fontSize: "15",
            borderColor: "rgba(33, 150, 243, 0.5)",
            borderRadius: "4px",
            "&:hover": { borderColor: "rgba(33, 150, 243, 0.5)" },
            height: 49,
          }}
          onClick={onButton1Click}>
          Sign up
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
