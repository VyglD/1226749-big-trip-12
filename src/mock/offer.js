import {getRandomInteger} from "../utils/common.js";

const OFFERS = new Map([
  [`Taxi`, [
    {
      name: `Order Uber`,
      cost: 20,
    }
  ]],
  [`Bus`, [
    {
      name: `Switch to comfort class`,
      cost: 100,
    }
  ]],
  [`Train`, [
    {
      name: `Switch to comfort class`,
      cost: 100,
    }
  ]],
  [`Ship`, [
    {
      name: `Switch to comfort class`,
      cost: 100,
    }
  ]],
  [`Transport`, [
    {
      name: `Switch to comfort class`,
      cost: 100,
    }
  ]],
  [`Drive`, [
    {
      name: `Rent a car`,
      cost: 200,
    }
  ]],
  [`Flight`, [
    {
      name: `Add luggage`,
      cost: 30,
    },
    {
      name: `Switch to comfort class`,
      cost: 100,
    },
    {
      name: `Add meal`,
      cost: 15,
    },
    {
      name: `Choose seats`,
      cost: 5,
    },
    {
      name: `Travel by train`,
      cost: 40,
    }
  ]],
  [`Check-in`, [
    {
      name: `Add breakfast`,
      cost: 50,
    }
  ]],
  [`Sightseeing`, [
    {
      name: `Book tickets`,
      cost: 40,
    },
    {
      name: `Lunch in city`,
      cost: 30,
    }
  ]],
  [`Restaurant`, [
    {
      name: `Musical accompaniment`,
      cost: 10,
    }
  ]],
]);


export const generateOffer = (type) => {
  return OFFERS.get(type).map((offer) => {
    return Object.assign(
        {checked: Boolean(getRandomInteger())},
        offer
    );
  });
};
