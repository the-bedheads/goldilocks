const { Router } = require('express');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const axios = require('axios');

const {
  User,
  ListingPhotos,
  Listing,
  Availability,
  Geolocation,
  PersonalityScale,
} = require('../index');

const listingRouter = Router();

listingRouter
  .get('/randomFour/:currentUser', async (req, res) => {
    const { currentUser } = req.params;
    await Listing.findAll({
      where: {
        userId: { [Op.not]: currentUser },
      },
      include: [
        {
          model: ListingPhotos,
        },
        {
          model: Availability,
          where: { accepted: false },
        },
        {
          model: User,
          include: { model: PersonalityScale },
        },
      ],
      order: [
        [Availability, 'startDate', 'ASC'],
        [Sequelize.literal('random()')],
      ],
      limit: 4,
    })
      .then((listings) => {
        res.send(listings);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  })
  .get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    Listing.findOne({
      where: {
        userId,
      },
    })
      .then((listing) => {
        res.send(listing);
      })
      .catch((err) => res.status(500).send(err));
  })
  .get('/byId/:listingId', (req, res) => {
    const { listingId } = req.params;
    Listing.findOne({
      where: {
        id: listingId,
      },
      include: { model: ListingPhotos },
    })
      .then((listing) => res.send(listing))
      .catch((err) => res.status(500).send(err));
  })
  .get('/fullSearch/:listingId/:location', async (req, res) => {
    const { listingId, location } = req.params;
    Listing.findOne({
      where: {
        id: listingId,
        listingCity: location,
      },
      include: [
        {
          model: ListingPhotos,
        },
        {
          model: User,
          include: { model: PersonalityScale },
        },
      ],
    })
      .then((listing) => res.send(listing))
      .catch((err) => res.status(500).send(err));
  });

// TEST
listingRouter.get('/geocode', (req, res) => {
  Geolocation.findAll({

  })
    .then((listingGeo) => res.send(listingGeo))
    .catch((err) => res.send(err.message));
});

listingRouter
  .post('/', async (req, res) => {
    console.log('hit');
    const {
      listingAddress,
      listingCity,
      listingState,
      listingZipCode,
      listingTitle,
      listingDescription,
      pets,
      ada,
      smoking,
      roommates,
      internet,
      privateBath,
      userId,
      photoUrl,
    } = req.body;
    const listingLocation = `${listingAddress} ${listingCity} ${listingState}`;
    const h = process.env.STATE === 'dev' ? process.env.HOST : process.env.DEP_HOST;
    const p = process.env.STATE === 'dev' ? 3000 : 8000;
    await axios.get(`http://${h}:${p}/map/listing/geocode/${listingLocation}`)
      .then(((geocoded) => {
        Listing.create({
          userId,
          listingAddress,
          listingCity,
          listingState,
          listingZipCode,
          listingTitle,
          listingDescription,
          pets,
          ada,
          smoking,
          roommates,
          internet,
          privateBath,
          latitude: geocoded.data[1],
          longitude: geocoded.data[0],
        })
          .then(({ dataValues }) => {
            const { id } = dataValues;
            if (photoUrl) {
              ListingPhotos.create({
                url: photoUrl,
                userId,
                listingId: id,
              });
            }
          })
          .catch((err) => res.send(err));
      }))
      .catch((err) => res.send(err));
    await User.update({ hasListing: true }, {
      where: {
        id: userId,
      },
    });
    res.send('success');
  });

module.exports = {
  listingRouter,
};
