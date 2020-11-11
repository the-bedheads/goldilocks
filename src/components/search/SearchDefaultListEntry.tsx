import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
  },
  inline: {
    display: 'inline',
  },
  image: {
    width: 220,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

interface DefaultListProps {
  listingId: number;
  user: number;
  title: string;
  city: string;
  state: string;
  avail: [];
}

const DefaultListEntry: React.FC<DefaultListProps> = ({
  listingId, user, title, city, state, avail,
}) => {
  const classes = useStyles();
  const location = `${city}, ${state}`;

  return (
    <div className={classes.root}>
      <ButtonBase className={classes.image} component={Link} to={`/listing/${user}`}>
        <img className={classes.img} alt="complex" src="https://ak.picdn.net/shutterstock/videos/6643253/thumb/1.jpg" />
      </ButtonBase>
      <Grid item xs component={Link} to={`/listing/${user}`}>
        <Typography variant="h6">
          {title}
        </Typography>
        <Typography variant="subtitle1">
          {location}
        </Typography>
      </Grid>
      {avail}
    </div>
  );
};

export default DefaultListEntry;
