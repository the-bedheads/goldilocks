import React, { FunctionComponent, useState } from 'react';
import {
  Grid, Container, Box, Button, makeStyles, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  TextField, DialogActions,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

type UserType = {
  image: string,
  name: string,
  pronouns: string,
  location: string,
  listingPhoto: string,
  userBio: string,
};
interface SidebarProps {
  user: UserType,
}

const useStyles = makeStyles({
  main: {
    border: 1,
    borderRadius: 2,
    borderStyle: 'solid',
    align: 'center',
    justify: 'center',
  },
  buttonStyle: {
    padding: '5px 10px 10px',
    justifyContent: 'center',
    display: 'flex',
  },
  infoStyle: {
    border: 1,
    borderRadius: 2,
    position: 'relative',
    borderStyle: 'solid',
    justifyContent: 'center',
    width: '50%',
    marginTop: '5px',
    marginBottom: '5px',
    '&:hover': {
      '& $overlayStyle': {
        opacity: '1',
      },
    },
  },
  imgStyle: {
    height: '30%',
    width: '30%',
    padding: '10px 10px 5px',
  },
  overlayStyle: {
    color: 'black',
    position: 'absolute',
    bottom: '0',
    right: '0',
    opacity: '.25',
  },
  editStyle: {
    position: 'absolute',
    bottom: '0',
    right: '0',
  },
});

const ProfileInfo: FunctionComponent<SidebarProps> = ({ user }): JSX.Element => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState(user.userBio);
  const [tempBio, setTempBio] = useState(bio);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (i: React.MouseEvent<HTMLButtonElement, MouseEvent>, check: boolean) => {
    if (check) {
      // save changes to DB
      // update field on screen
      setBio(tempBio);
      console.log(i);
    }
    setOpen(false);
  };

  const handleClickOff = () => {
    setOpen(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    console.log(e.target.value);
    setTempBio(e.target.value);
  };

  return (
    <>
      <Container className={classes.main}>
        <Grid container justify="center" item xs={12}>
          <img
            src={user.listingPhoto}
            alt="nobodys home"
            className={classes.imgStyle}
          />
        </Grid>
        <Grid item xs={12}>
          <Box className={classes.buttonStyle}>
            <Button
              variant="contained"
              color="primary"
            >
              Availability
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Container className={classes.infoStyle}>
            {bio}
            <IconButton className={classes.editStyle}>
              <EditIcon className={classes.overlayStyle} onClick={handleOpen} />
            </IconButton>
            <Dialog open={open} onClose={handleClickOff} fullWidth maxWidth="md" aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit your Bio</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  multiline
                  rows={3}
                  variant="outlined"
                  defaultValue={bio}
                  fullWidth
                  onChange={(e) => handleTextChange(e)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={(i) => handleClose(i, false)} color="primary">
                  Cancel
                </Button>
                <Button onClick={(i) => handleClose(i, true)} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Grid>
      </Container>
    </>
  );
};

export default ProfileInfo;
